import { Kbd } from '@opnay/city-ds-react/kbd';

export default function KbdShortcutsExample() {
  return (
    <div className="city-docs-kbd-shortcuts">
      <div className="city-docs-kbd-shortcut">
        <span>명령 팔레트</span>
        <Kbd>⌘ K</Kbd>
      </div>
      <div className="city-docs-kbd-shortcut">
        <span>빠른 검색</span>
        <Kbd>/</Kbd>
      </div>
    </div>
  );
}
