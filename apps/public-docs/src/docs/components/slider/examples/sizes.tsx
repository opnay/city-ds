import { Slider } from '@opnay/city-ds-react/slider';

const sizes = ['xsm', 'sm', 'md', 'lg', 'xlg'] as const;

export default function SliderSizesExample() {
  return (
    <div className="city-docs-example-stack">
      {sizes.map((size) => (
        <div className="city-docs-example-variant" key={size}>
          <span className="city-docs-example-label">{size}</span>
          <Slider.Root defaultValue={40} size={size}>
            <Slider.Control>
              <Slider.Track>
                <Slider.Indicator />
              </Slider.Track>
              <Slider.Thumb aria-label={`${size} 볼륨`} />
            </Slider.Control>
          </Slider.Root>
        </div>
      ))}
    </div>
  );
}
