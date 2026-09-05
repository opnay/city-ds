import { Kbd } from '@opnay/city-ds-react/kbd';

export default function KbdShortcutsExample() {
  return (
    <div className="city-docs-kbd-shortcuts">
      <div className="city-docs-kbd-shortcut">
        <span>명령 팔레트</span>
        <span aria-label="명령 팔레트 단축키" className="city-docs-kbd-keys" role="group">
          <Kbd>⌘</Kbd>
          <span aria-hidden="true">+</span>
          <Kbd>K</Kbd>
        </span>
      </div>
      <div className="city-docs-kbd-shortcut">
        <span>빠른 검색</span>
        <span aria-label="빠른 검색 단축키" className="city-docs-kbd-keys" role="group">
          <Kbd>/</Kbd>
        </span>
      </div>
    </div>
  );
}
