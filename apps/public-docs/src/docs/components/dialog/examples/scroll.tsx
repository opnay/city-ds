import { Button } from '@opnay/city-ds-react/button';
import { Dialog } from '@opnay/city-ds-react/dialog';

const scrollModes = ['none', 'body'] as const;
const activityTypes = [
  '프로덕션 배포 완료',
  '환경 변수 변경',
  '멤버 권한 수정',
  '도메인 연결 확인',
];

export default function DialogScrollExample() {
  return (
    <div className="city-docs-example-row">
      {scrollModes.map((scroll) => (
        <Dialog.Root key={scroll}>
          <Dialog.Trigger render={<Button variant="secondary" />}>
            {scroll === 'none' ? '전체 스크롤' : '본문 스크롤'}
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Backdrop />
            <Dialog.Viewport>
              <Dialog.Popup scroll={scroll}>
                <Dialog.Header>
                  <div>
                    <Dialog.Title>프로젝트 활동</Dialog.Title>
                    <Dialog.Description>
                      Atlas 프로젝트의 최근 변경을 시간순으로 확인합니다.
                    </Dialog.Description>
                  </div>
                </Dialog.Header>
                <Dialog.Body>
                  <ul className="-my-3 divide-y divide-city-border">
                    {Array.from({ length: 16 }, (_, index) => (
                      <li className="py-3" key={index}>
                        <p className="text-sm font-medium">
                          {activityTypes[index % activityTypes.length]}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-city-muted-foreground">
                          {index + 1}시간 전 · 운영팀
                        </p>
                      </li>
                    ))}
                  </ul>
                </Dialog.Body>
                <Dialog.Footer>
                  <Dialog.Close render={<Button variant="secondary" />}>닫기</Dialog.Close>
                </Dialog.Footer>
              </Dialog.Popup>
            </Dialog.Viewport>
          </Dialog.Portal>
        </Dialog.Root>
      ))}
    </div>
  );
}
