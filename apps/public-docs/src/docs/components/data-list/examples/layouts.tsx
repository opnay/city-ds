import { DataList } from '@opnay/city-ds-react/data-list';

export default function DataListLayoutsExample() {
  return (
    <div className="grid w-full gap-8">
      {(['horizontal', 'vertical'] as const).flatMap((orientation) =>
        (['comfortable', 'compact'] as const).map((density) => (
          <section key={`${orientation}-${density}`} className="grid gap-3">
            <h3 className="m-0 text-sm font-medium">
              {orientation === 'horizontal' ? '가로' : '세로'} ·{' '}
              {density === 'comfortable' ? '기본 간격' : '좁은 간격'}
            </h3>
            <DataList.Root orientation={orientation} density={density} dividers>
              <DataList.Item>
                <DataList.Label>이름</DataList.Label>
                <DataList.Value>김서연</DataList.Value>
              </DataList.Item>
              <DataList.Item>
                <DataList.Label>이메일</DataList.Label>
                <DataList.Value>seoyeon@example.com</DataList.Value>
              </DataList.Item>
              <DataList.Item>
                <DataList.Label>설명</DataList.Label>
                <DataList.Value>
                  여러 줄로 이어지는 값도 이름과 구분하여 읽을 수 있습니다. 좁은 컨테이너에서는 이름
                  아래에 값을 표시합니다.
                </DataList.Value>
              </DataList.Item>
            </DataList.Root>
          </section>
        )),
      )}
    </div>
  );
}
