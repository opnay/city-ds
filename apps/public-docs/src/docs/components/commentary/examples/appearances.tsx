import { Commentary, DensityProvider } from '@opnay/city-ds-react';

export default function AppearancesExample() {
  return (
    <DensityProvider density="compact" className="grid gap-6">
      {(['plain', 'bubble'] as const).flatMap((appearance) =>
        (['start', 'end'] as const).map((align) => (
          <Commentary.Root key={`${appearance}-${align}`} appearance={appearance} align={align}>
            <Commentary.Header>
              <Commentary.Author>동일한 작성자</Commentary.Author>
              <Commentary.Meta>
                {appearance} / {align}
              </Commentary.Meta>
            </Commentary.Header>
            <Commentary.Content>작성자와 무관하게 표현과 정렬을 선택합니다.</Commentary.Content>
          </Commentary.Root>
        )),
      )}
    </DensityProvider>
  );
}
