import { useState } from 'react';
import { Slider } from '@opnay/city-ds-react/slider';

export default function SliderStatesExample() {
  const [value, setValue] = useState(40);

  return (
    <div className="city-docs-example-stack">
      <div className="city-docs-example-variant">
        <span className="city-docs-example-label">제어된 단일 값</span>
        <Slider.Root onValueChange={setValue} value={value}>
          <Slider.Control>
            <Slider.Track>
              <Slider.Indicator />
            </Slider.Track>
            <Slider.Thumb aria-label="제어된 우선순위" />
          </Slider.Control>
          <Slider.Value />
        </Slider.Root>
      </div>
      <div className="city-docs-example-variant">
        <span className="city-docs-example-label">비제어 범위</span>
        <Slider.Root defaultValue={[25, 75]} minStepsBetweenValues={1} step={5}>
          <Slider.Control>
            <Slider.Track>
              <Slider.Indicator />
            </Slider.Track>
            <Slider.Thumb
              getAriaLabel={(index) => (index === 0 ? '최소 우선순위' : '최대 우선순위')}
              index={0}
            />
            <Slider.Thumb
              getAriaLabel={(index) => (index === 0 ? '최소 우선순위' : '최대 우선순위')}
              index={1}
            />
          </Slider.Control>
          <Slider.Value />
        </Slider.Root>
      </div>
      <div className="city-docs-example-variant">
        <span className="city-docs-example-label">세로·비활성</span>
        <div className="city-docs-slider-vertical">
          <Slider.Root defaultValue={60} disabled orientation="vertical">
            <Slider.Control>
              <Slider.Track>
                <Slider.Indicator />
              </Slider.Track>
              <Slider.Thumb aria-label="비활성 세로 우선순위" />
            </Slider.Control>
            <Slider.Value />
          </Slider.Root>
        </div>
      </div>
    </div>
  );
}
