import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Slider as RootSlider } from '../../src';
import { Slider, type SliderRootProps } from '../../src/components/slider';

function SliderParts({ range = false }: { range?: boolean }) {
  return (
    <>
      <Slider.Control>
        <Slider.Track>
          <Slider.Indicator />
        </Slider.Track>
        {range ? (
          <>
            <Slider.Thumb
              getAriaLabel={(index) => (index === 0 ? '최소 범위' : '최대 범위')}
              index={0}
            />
            <Slider.Thumb
              getAriaLabel={(index) => (index === 0 ? '최소 범위' : '최대 범위')}
              index={1}
            />
          </>
        ) : (
          <Slider.Thumb aria-label="볼륨" />
        )}
      </Slider.Control>
      <Slider.Value>{(_, values) => values.join('–')}</Slider.Value>
    </>
  );
}

function assertSliderPropsContract() {
  const single: SliderRootProps<number> = { defaultValue: 40, max: 100, min: 0, step: 5 };
  const range: SliderRootProps<readonly number[]> = {
    defaultValue: [25, 75],
    minStepsBetweenValues: 1,
  };

  void single;
  void range;
}

void assertSliderPropsContract;

describe('Slider', () => {
  it('exports the same compound API from the package root', () => {
    expect(RootSlider).toBe(Slider);
  });

  it('uses Base UI parts for a sized horizontal slider and value output', () => {
    render(
      <Slider.Root
        aria-label="볼륨 조절"
        className={(state) => (state.orientation === 'horizontal' ? 'state-horizontal' : undefined)}
        defaultValue={40}
        size="lg"
      >
        <SliderParts />
      </Slider.Root>,
    );

    const slider = screen.getByRole('slider', { name: '볼륨' });
    const group = screen.getByRole('group', { name: '볼륨 조절' });
    const control = slider.parentElement?.parentElement;

    expect(group).toHaveAttribute('data-city-slider', '');
    expect(group).toHaveAttribute('data-city-size', 'lg');
    expect(group).toHaveClass('w-full', 'state-horizontal');
    expect(control).toHaveAttribute('data-city-slider-control', '');
    expect(control).toHaveClass('h-5', 'w-full');
    expect(control?.querySelector('.bg-city-primary')).toHaveClass('h-full');
    const thumb = slider.closest('[data-city-slider-thumb]');
    expect(thumb).toHaveAttribute('data-city-slider-thumb', '');
    expect(thumb).toHaveClass('size-5', 'border-city-primary');
    expect(screen.getByText('40')).toHaveClass('tabular-nums');
  });

  it('steps with the keyboard, respects min/max, and reports Base UI keyboard details', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <Slider.Root defaultValue={10} max={20} min={0} onValueChange={onValueChange} step={5}>
        <SliderParts />
      </Slider.Root>,
    );

    const slider = screen.getByRole('slider', { name: '볼륨' });
    slider.focus();
    await user.keyboard('[ArrowRight][PageUp]');

    expect(slider).toHaveValue('20');
    expect(onValueChange).toHaveBeenLastCalledWith(
      20,
      expect.objectContaining({ reason: 'keyboard' }),
    );
  });

  it('supports range values, vertical keyboard interaction, and named thumbs', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <div className="h-48">
        <Slider.Root
          aria-label="예산 범위"
          defaultValue={[25, 75]}
          onValueChange={onValueChange}
          orientation="vertical"
          step={5}
        >
          <SliderParts range />
        </Slider.Root>
      </div>,
    );

    const minimum = screen.getByRole('slider', { name: '최소 범위' });
    const maximum = screen.getByRole('slider', { name: '최대 범위' });
    const group = screen.getByRole('group', { name: '예산 범위' });

    expect(group).toHaveClass('inline-flex', 'h-full', 'flex-col');
    expect(minimum.parentElement?.parentElement).toHaveClass('h-full', 'min-h-32', 'w-5');
    expect(minimum.parentElement?.parentElement?.querySelector('.bg-city-muted')).toHaveClass(
      'h-full',
      'w-1.5',
    );
    expect(minimum).toHaveValue('25');
    expect(maximum).toHaveValue('75');
    expect(screen.getByText('25–75')).toBeVisible();

    minimum.focus();
    await user.keyboard('[ArrowUp]');

    expect(minimum).toHaveValue('30');
    expect(onValueChange).toHaveBeenLastCalledWith(
      [30, 75],
      expect.objectContaining({ activeThumbIndex: 0, reason: 'keyboard' }),
    );
  });

  it('supports controlled and default values without bypassing Slider state', async () => {
    const user = userEvent.setup();

    function ControlledSlider() {
      const [value, setValue] = React.useState(10);

      return (
        <Slider.Root onValueChange={setValue} value={value}>
          <Slider.Control>
            <Slider.Track>
              <Slider.Indicator />
            </Slider.Track>
            <Slider.Thumb aria-label="제어된 값" />
          </Slider.Control>
          <Slider.Value />
        </Slider.Root>
      );
    }

    render(
      <>
        <ControlledSlider />
        <Slider.Root defaultValue={30}>
          <Slider.Control>
            <Slider.Track>
              <Slider.Indicator />
            </Slider.Track>
            <Slider.Thumb aria-label="비제어 값" />
          </Slider.Control>
          <Slider.Value />
        </Slider.Root>
      </>,
    );

    const controlled = screen.getByRole('slider', { name: '제어된 값' });
    const uncontrolled = screen.getByRole('slider', { name: '비제어 값' });
    controlled.focus();
    await user.keyboard('[ArrowRight]');
    uncontrolled.focus();
    await user.keyboard('[ArrowRight]');

    expect(controlled).toHaveValue('11');
    expect(uncontrolled).toHaveValue('31');
  });

  it('submits Base UI form values and blocks disabled interaction', async () => {
    const user = userEvent.setup();
    let submittedValue: FormDataEntryValue | null = null;
    const onDisabledChange = vi.fn();

    render(
      <>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            submittedValue = new FormData(event.currentTarget).get('capacity');
          }}
        >
          <Slider.Root defaultValue={6} max={12} min={1} name="capacity">
            <Slider.Control>
              <Slider.Track>
                <Slider.Indicator />
              </Slider.Track>
              <Slider.Thumb aria-label="용량" />
            </Slider.Control>
          </Slider.Root>
          <button type="submit">저장</button>
        </form>
        <Slider.Root defaultValue={8} disabled onValueChange={onDisabledChange}>
          <Slider.Control>
            <Slider.Track>
              <Slider.Indicator />
            </Slider.Track>
            <Slider.Thumb aria-label="잠긴 용량" />
          </Slider.Control>
        </Slider.Root>
      </>,
    );

    await user.click(screen.getByRole('button', { name: '저장' }));
    const disabled = screen.getByRole('slider', { name: '잠긴 용량' });
    disabled.focus();
    await user.keyboard('[ArrowRight]');

    expect(submittedValue).toBe('6');
    expect(disabled).toBeDisabled();
    expect(disabled).toHaveValue('8');
    expect(onDisabledChange).not.toHaveBeenCalled();
  });

  it('preserves the Base UI render composition contract', () => {
    const ref = React.createRef<HTMLDivElement>();

    render(
      <Slider.Root
        aria-label="구성된 값"
        defaultValue={20}
        ref={ref}
        render={<section data-composed="true" />}
      >
        <SliderParts />
      </Slider.Root>,
    );

    const group = screen.getByRole('group', { name: '구성된 값' });

    expect(ref.current).toBe(group);
    expect(group).toHaveAttribute('data-composed', 'true');
  });
});
