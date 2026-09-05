import { Slider } from '@opnay/city-ds-react/slider';

export default function SliderAnchorsExample() {
  return (
    <Slider.Root defaultValue={20} step={5}>
      <Slider.Control>
        <Slider.Track>
          <Slider.Indicator />
          <Slider.Anchor value={40} aria-label="우선순위 40" />
          <Slider.Anchor value={80} aria-label="우선순위 80" />
        </Slider.Track>
        <Slider.Thumb aria-label="우선순위" />
      </Slider.Control>
      <Slider.Value />
    </Slider.Root>
  );
}
