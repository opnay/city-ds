import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ProjectSettings } from './examples/project-settings';
import { EnvironmentVariables, type EnvironmentVariable } from './examples/environment-variables';
import { DeploymentHistory } from './examples/deployment-history';
import { DeploymentDetails } from './examples/deployment-details';
import { exampleDeployments } from './examples/deployment-data';

const project = { id: 'prj_1', name: 'City', description: 'Website' };
const variables: EnvironmentVariable[] = [
  { id: 'secret', name: 'SERVICE_TOKEN', environment: 'staging', secret: true },
  {
    id: 'url',
    name: 'API_URL',
    environment: 'staging',
    secret: false,
    value: 'https://example.com',
  },
];

describe('Project operations', () => {
  it('preserves failed edits, saves acknowledged values and cancels to the last saved values', async () => {
    const user = userEvent.setup();
    const save = vi
      .fn()
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce(undefined);
    render(<ProjectSettings initialProject={project} onSave={save} />);
    const name = screen.getByRole('textbox', { name: '프로젝트 이름' });
    expect(screen.getByRole('button', { name: '변경 저장' })).toBeDisabled();
    await user.clear(name);
    await user.type(name, 'City Docs');
    await user.click(screen.getByRole('button', { name: '변경 저장' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('저장하지 못했습니다');
    expect(name).toHaveValue('City Docs');
    await user.click(screen.getByRole('button', { name: '변경 저장' }));
    expect(await screen.findByRole('status')).toHaveTextContent('저장했습니다');
    await user.type(name, ' changed');
    await user.click(screen.getByRole('button', { name: '취소' }));
    expect(name).toHaveValue('City Docs');
    expect(save).toHaveBeenLastCalledWith({ ...project, name: 'City Docs' });
  });

  it('blocks duplicate settings saves and respects read-only access', async () => {
    const user = userEvent.setup();
    let finish!: () => void;
    const save = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          finish = resolve;
        }),
    );
    const { rerender } = render(<ProjectSettings initialProject={project} onSave={save} />);
    await user.type(screen.getByRole('textbox', { name: '프로젝트 설명' }), ' edit');
    await user.dblClick(screen.getByRole('button', { name: '변경 저장' }));
    expect(save).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: '취소' })).toBeDisabled();
    await act(async () => finish());
    rerender(<ProjectSettings initialProject={project} onSave={save} canManage={false} />);
    expect(screen.getByRole('textbox', { name: '프로젝트 이름' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '변경 저장' })).toBeDisabled();
  });

  it('copies a project identifier and reports clipboard failure', async () => {
    const user = userEvent.setup();
    const copy = vi
      .spyOn(navigator.clipboard, 'writeText')
      .mockRejectedValueOnce(new Error('denied'))
      .mockResolvedValueOnce(undefined);
    render(<ProjectSettings initialProject={project} onSave={vi.fn()} />);
    await user.click(screen.getByRole('button', { name: 'ID 복사' }));
    expect(screen.getByRole('status')).toHaveTextContent('복사하지 못했습니다');
    await user.click(screen.getByRole('button', { name: 'ID 복사' }));
    expect(copy).toHaveBeenLastCalledWith('prj_1');
    expect(screen.getByRole('status')).toHaveTextContent('복사했습니다');
    copy.mockRestore();
  });

  it('never pre-fills an existing secret, preserves failed replacements and closes on success', async () => {
    const user = userEvent.setup();
    const save = vi
      .fn()
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce(undefined);
    render(<EnvironmentVariables variables={variables} onSave={save} onRemove={vi.fn()} />);
    expect(screen.getByText('••••••••')).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'SERVICE_TOKEN 수정' }));
    const value = screen.getByLabelText('값');
    expect(value).toHaveValue('');
    expect(value).toHaveAttribute('type', 'password');
    await user.type(value, 'replacement-value');
    await user.click(screen.getByRole('button', { name: '변수 저장' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('저장하지 못했습니다');
    expect(value).toHaveValue('replacement-value');
    await user.click(screen.getByRole('button', { name: '변수 저장' }));
    expect(save).toHaveBeenLastCalledWith({
      id: 'secret',
      name: 'SERVICE_TOKEN',
      environment: 'staging',
      secret: true,
      value: 'replacement-value',
    });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.queryByDisplayValue('replacement-value')).not.toBeInTheDocument();
  });

  it('rejects duplicate names within an environment and exposes empty environments', async () => {
    const user = userEvent.setup();
    const save = vi.fn();
    render(<EnvironmentVariables variables={variables} onSave={save} onRemove={vi.fn()} />);
    await user.click(screen.getByRole('button', { name: '변수 추가' }));
    await user.type(screen.getByRole('textbox', { name: '변수 이름' }), 'API_URL');
    await user.type(screen.getByLabelText('값'), 'value');
    await user.click(screen.getByRole('button', { name: '변수 저장' }));
    expect(screen.getByRole('alert')).toHaveTextContent('같은 이름');
    expect(save).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: '취소' }));
    await user.click(screen.getByRole('radio', { name: '운영' }));
    expect(screen.getByText('이 환경에 등록된 변수가 없습니다.')).toBeVisible();
  });

  it('confirms deletion, blocks duplicate mutations and retains the record after failure', async () => {
    const user = userEvent.setup();
    let reject!: (error: Error) => void;
    const remove = vi.fn(
      () =>
        new Promise<void>((_, fail) => {
          reject = fail;
        }),
    );
    render(<EnvironmentVariables variables={variables} onSave={vi.fn()} onRemove={remove} />);
    await user.click(screen.getByRole('button', { name: 'SERVICE_TOKEN 삭제' }));
    expect(remove).not.toHaveBeenCalled();
    await user.dblClick(screen.getByRole('button', { name: '변수 삭제' }));
    expect(remove).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: '취소' })).toBeDisabled();
    await act(async () => reject(new Error('offline')));
    expect(screen.getByRole('alert')).toHaveTextContent('삭제하지 못했습니다');
    await user.click(screen.getByRole('button', { name: '취소' }));
    expect(screen.getByText('SERVICE_TOKEN')).toBeVisible();
  });

  it('combines environment, status and search filters and opens the selected deployment', async () => {
    const user = userEvent.setup();
    const view = vi.fn();
    render(<DeploymentHistory records={exampleDeployments} onView={view} />);
    await user.click(screen.getByRole('combobox', { name: '배포 환경' }));
    await user.click(await screen.findByRole('option', { name: '운영' }));
    await user.click(screen.getByRole('combobox', { name: '실행 상태' }));
    await user.click(await screen.findByRole('option', { name: '실패' }));
    expect(screen.getByRole('status')).toHaveTextContent('실행 1건');
    await user.click(screen.getByRole('button', { name: 'v1.2.1 dep_103 상세 보기' }));
    expect(view).toHaveBeenCalledWith('dep_103');
    await user.type(screen.getByRole('searchbox', { name: '실행 검색' }), 'unknown');
    expect(screen.getByText('조건에 맞는 실행 기록이 없습니다.')).toBeVisible();
    await user.click(screen.getByRole('button', { name: '필터 초기화' }));
    expect(screen.getByRole('status')).toHaveTextContent('실행 3건');
  });

  it('handles history loading, error recovery and an empty list', async () => {
    const user = userEvent.setup();
    const retry = vi.fn();
    const { rerender } = render(<DeploymentHistory records={[]} onView={vi.fn()} loading />);
    expect(screen.getByLabelText('실행 기록 불러오는 중')).toBeInTheDocument();
    rerender(<DeploymentHistory records={[]} onView={vi.fn()} error="조회 실패" onRetry={retry} />);
    await user.click(screen.getByRole('button', { name: '다시 불러오기' }));
    expect(retry).toHaveBeenCalledOnce();
    rerender(<DeploymentHistory records={[]} onView={vi.fn()} />);
    expect(screen.getByText('아직 실행 기록이 없습니다.')).toBeVisible();
  });

  it('switches logs independently of execution state and resets selection for another deployment', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<DeploymentDetails deployment={exampleDeployments[0]!} />);
    expect(screen.getByLabelText('실행 로그 내용')).toHaveTextContent('PUBLIC_API_URL');
    expect(screen.getByRole('region', { name: '빌드 로그' })).toHaveTextContent('40초');
    const failed = screen.getByRole('tab', { name: '빌드 실패' });
    await user.click(screen.getByRole('tab', { name: '배포 실행 전' }));
    expect(screen.getByText('아직 기록된 로그가 없습니다.')).toBeVisible();
    expect(screen.getByRole('button', { name: '로그 복사' })).toBeDisabled();
    expect(failed).toHaveTextContent('실패');
    rerender(<DeploymentDetails deployment={exampleDeployments[2]!} />);
    expect(screen.getByLabelText('실행 로그 내용')).toHaveTextContent('새 버전 적용');
    expect(document.querySelector('[aria-current="step"]')).toBeNull();
  });
});
