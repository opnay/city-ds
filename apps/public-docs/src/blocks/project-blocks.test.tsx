import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ProjectCreation } from './examples/project-creation';
import { DeploymentPreparation } from './examples/deployment-preparation';
import { BLOCK_GROUPS } from './block-catalog';

async function reachDeploymentReview() {
  const user = userEvent.setup();
  await user.click(screen.getByRole('button', { name: '다음' }));
  await user.click(screen.getByRole('button', { name: '설정 검증' }));
  await screen.findByRole('checkbox');
  return user;
}

describe('Project blocks', () => {
  it('lists creation and deployment together in the project category', () => {
    expect(
      BLOCK_GROUPS.find((group) => group.title === '프로젝트')?.items.map((entry) => entry.slug),
    ).toEqual([
      'project-settings',
      'environment-variables',
      'deployment-history',
      'deployment-details',
      'project-creation',
      'deployment-preparation',
    ]);
  });

  it('preserves draft inputs on back and failure, and completes only after successful retry', async () => {
    const user = userEvent.setup();
    const create = vi
      .fn()
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce(undefined);
    render(<ProjectCreation onCreate={create} />);
    await user.type(screen.getByRole('textbox', { name: '프로젝트 이름' }), 'City');
    await user.click(screen.getByRole('button', { name: '다음' }));
    await user.type(screen.getByRole('textbox', { name: '초대 이메일' }), 'team@example.com');
    await user.click(screen.getByRole('button', { name: '이전' }));
    expect(screen.getByRole('textbox', { name: '프로젝트 이름' })).toHaveValue('City');
    await user.click(screen.getByRole('button', { name: '다음' }));
    expect(screen.getByRole('textbox', { name: '초대 이메일' })).toHaveValue('team@example.com');
    await user.click(screen.getByRole('button', { name: '다음' }));
    await user.click(screen.getByRole('button', { name: '프로젝트 만들기' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('입력한 내용은 유지');
    await user.click(screen.getByRole('button', { name: '프로젝트 만들기' }));
    expect(await screen.findByRole('status')).toHaveTextContent('City 프로젝트를 만들었습니다.');
    expect(create).toHaveBeenLastCalledWith({ name: 'City', email: 'team@example.com' });
    expect(screen.getByRole('heading', { name: '완료' })).toHaveFocus();
  });

  it('shows prior inputs in the step summary and current instructions in the body', async () => {
    const user = userEvent.setup();
    const { container } = render(<ProjectCreation onCreate={vi.fn()} />);
    expect(container.querySelector('[data-city-stepper]')).not.toHaveTextContent(
      '프로젝트 이름을 정합니다.',
    );
    await user.type(screen.getByRole('textbox', { name: '프로젝트 이름' }), 'City summary');
    await user.click(screen.getByRole('button', { name: '다음' }));
    expect(container.querySelector('[data-city-stepper]')).toHaveTextContent('City summary');
    expect(container.querySelector('[data-city-stepper]')).not.toHaveTextContent(
      '함께할 팀원을 초대합니다.',
    );
    expect(container.querySelector('.city-block-project-content')).toHaveTextContent(
      '함께할 팀원을 초대합니다.',
    );
  });

  it('blocks duplicate creation and navigation while the request is pending', async () => {
    const user = userEvent.setup();
    let finish!: () => void;
    const create = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          finish = resolve;
        }),
    );
    render(<ProjectCreation onCreate={create} />);
    await user.type(screen.getByRole('textbox', { name: '프로젝트 이름' }), 'City');
    await user.click(screen.getByRole('button', { name: '다음' }));
    await user.click(screen.getByRole('button', { name: '다음' }));
    await user.dblClick(screen.getByRole('button', { name: '프로젝트 만들기' }));
    expect(create).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: '이전' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '기본 정보' })).toBeDisabled();
    await act(async () => finish());
    expect(screen.getByRole('status')).toHaveTextContent('City');
  });

  it('retains the environment on validation failure and requires explicit review before deployment', async () => {
    const validate = vi
      .fn()
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce(undefined);
    const deploy = vi
      .fn()
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce(undefined);
    const user = userEvent.setup();
    render(<DeploymentPreparation revision="v2" onValidate={validate} onDeploy={deploy} />);
    await user.click(screen.getByRole('radio', { name: '운영' }));
    await user.click(screen.getByRole('button', { name: '다음' }));
    await user.click(screen.getByRole('button', { name: '설정 검증' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('검증하지 못했습니다');
    await user.click(screen.getByRole('button', { name: '설정 검증' }));
    expect(await screen.findByRole('button', { name: '배포 단계로' })).toBeDisabled();
    await user.click(screen.getByRole('checkbox'));
    await user.click(screen.getByRole('button', { name: '배포 단계로' }));
    await user.click(screen.getByRole('button', { name: '배포 시작' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('배포하지 못했습니다');
    await user.click(screen.getByRole('button', { name: '배포 시작' }));
    expect(await screen.findByRole('status')).toHaveTextContent('운영 환경에 v2');
    expect(deploy).toHaveBeenLastCalledWith({ environment: 'production', revision: 'v2' });
  });

  it('invalidates verification when the revision or environment changes', async () => {
    const validate = vi.fn().mockResolvedValue(undefined);
    const deploy = vi.fn();
    const { rerender } = render(
      <DeploymentPreparation revision="v1" onValidate={validate} onDeploy={deploy} />,
    );
    const user = await reachDeploymentReview();
    await user.click(screen.getByRole('checkbox'));
    rerender(<DeploymentPreparation revision="v2" onValidate={validate} onDeploy={deploy} />);
    expect(screen.getByRole('button', { name: '배포 단계로' })).toBeDisabled();
    expect(screen.getByRole('alert')).toHaveTextContent('대상이 변경');
    await user.click(screen.getByRole('button', { name: '환경 선택' }));
    await user.click(screen.getByRole('radio', { name: '운영' }));
    await user.click(screen.getByRole('button', { name: '다음' }));
    await user.click(screen.getByRole('button', { name: '설정 검증' }));
    expect(await screen.findByRole('checkbox')).not.toBeChecked();
    expect(validate).toHaveBeenLastCalledWith({ environment: 'production', revision: 'v2' });
    expect(deploy).not.toHaveBeenCalled();
  });

  it('blocks duplicate deployment and reports the deployed snapshot if props change in flight', async () => {
    let finish!: () => void;
    const validate = vi.fn().mockResolvedValue(undefined);
    const deploy = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          finish = resolve;
        }),
    );
    const { rerender } = render(
      <DeploymentPreparation revision="v1" onValidate={validate} onDeploy={deploy} />,
    );
    const user = await reachDeploymentReview();
    await user.click(screen.getByRole('checkbox'));
    await user.click(screen.getByRole('button', { name: '배포 단계로' }));
    await user.dblClick(screen.getByRole('button', { name: '배포 시작' }));
    expect(deploy).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: '이전' })).toBeDisabled();
    rerender(<DeploymentPreparation revision="v2" onValidate={validate} onDeploy={deploy} />);
    await act(async () => finish());
    expect(screen.getByRole('status')).toHaveTextContent('v1');
    expect(screen.getByRole('status')).not.toHaveTextContent('v2');
  });
});
