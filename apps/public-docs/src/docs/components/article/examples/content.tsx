import { Check } from 'lucide-react';
import { Article } from '@opnay/city-ds-react/article';

const markdown = `## 변경 내용

이 문단은 **중요한 결과**, *보충 설명*, ~~취소한 계획~~과 [접근성 안내](/accessibility)를 보여줍니다.\\
두 번째 줄은 같은 문단의 줄바꿈입니다.

---

### 확인 항목

- 변경 파일을 확인합니다.
- 결과를 검토합니다.
  - 좁은 화면에서도 항목을 읽습니다.

1. 변경 내용을 읽습니다.
2. 검증 결과를 확인합니다.

- [x] 목록과 코드 확인
- [ ] 배포 전 검토

> 완료한 일과 남은 일을 구분해 안내합니다.

인라인 명령은 \`pnpm check\`입니다.

\`\`\`tsx
<Article markdown={response} />
\`\`\`

### 파일 상태

| 파일 | 상태 |
| --- | --- |
| article.tsx | 완료 |
| styles.css | 검토 중 |

이미지 대체 텍스트: ![상태 다이어그램](https://example.com/status.png)

설명에는 각주도 연결할 수 있습니다.[^note]

[^note]: 각주는 본문 뒤에 표시됩니다.
`;

export default function ContentExample({ format = 'markdown' }: { format?: 'markdown' | 'react' }) {
  if (format === 'react') {
    return (
      <Article>
        <h2>변경 내용</h2>
        <p>
          이 문단은 <strong>중요한 결과</strong>, <em>보충 설명</em>, <del>취소한 계획</del>과{' '}
          <a href="/accessibility">접근성 안내</a>를 보여줍니다.
          <br />
          두 번째 줄은 같은 문단의 줄바꿈입니다. <b>이 부분은 React children의 b 태그입니다.</b>
        </p>
        <hr />
        <h3>확인 항목</h3>
        <ul>
          <li>변경 파일을 확인합니다.</li>
          <li>
            결과를 검토합니다.
            <ul>
              <li>좁은 화면에서도 항목을 읽습니다.</li>
            </ul>
          </li>
        </ul>
        <ol>
          <li>변경 내용을 읽습니다.</li>
          <li>검증 결과를 확인합니다.</li>
        </ol>
        <ul>
          <li className="task-list-item">
            <span aria-label="완료" data-city-article-task-state="complete" role="img">
              <Check aria-hidden="true" className="size-3" strokeWidth={3} />
            </span>
            목록과 코드 확인
          </li>
          <li className="task-list-item">
            <span aria-label="미완료" data-city-article-task-state="pending" role="img" />
            배포 전 검토
          </li>
        </ul>
        <blockquote>
          <p>완료한 일과 남은 일을 구분해 안내합니다.</p>
        </blockquote>
        <p>
          인라인 명령은 <code>pnpm check</code>입니다.
        </p>
        <pre aria-label="Article 사용 예제" tabIndex={0}>
          <code>{'<Article markdown={response} />'}</code>
        </pre>
        <h3>파일 상태</h3>
        <div aria-label="파일 상태 표" className="overflow-x-auto" role="region" tabIndex={0}>
          <table>
            <thead>
              <tr>
                <th scope="col">파일</th>
                <th scope="col">상태</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>article.tsx</td>
                <td>완료</td>
              </tr>
              <tr>
                <td>styles.css</td>
                <td>검토 중</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          이미지 대체 텍스트: <span>상태 다이어그램</span>
        </p>
        <p>
          설명에는 각주도 연결할 수 있습니다.
          <sup>
            <a
              aria-describedby="article-note-label"
              data-footnote-ref
              href="#article-note"
              id="article-note-ref"
            >
              1
            </a>
          </sup>
        </p>
        <section aria-labelledby="article-note-label" data-footnotes>
          <h2 id="article-note-label">각주</h2>
          <ol>
            <li id="article-note">
              각주는 본문 뒤에 표시됩니다.{' '}
              <a
                aria-label="각주 1의 본문 참조 1로 돌아가기"
                data-footnote-backref
                href="#article-note-ref"
              >
                본문으로 돌아가기
              </a>
            </li>
          </ol>
        </section>
      </Article>
    );
  }

  return <Article markdown={markdown} />;
}
