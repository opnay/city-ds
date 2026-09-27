import { Article } from '@opnay/city-ds-react/article';

const markdown = `# 제목 1

## 제목 2

### 제목 3

#### 제목 4

##### 제목 5

###### 제목 6`;

export default function HeadingsExample() {
  return <Article markdown={markdown} />;
}
