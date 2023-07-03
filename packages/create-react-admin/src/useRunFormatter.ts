import execa from 'execa';
import { useStderr } from 'ink';
import { ProjectConfiguration } from './ProjectState';

export const useRunFormatter = () => {
    const { stderr } = useStderr();

    return async (state: ProjectConfiguration) => {
        const command = execa(`${state.installer}`, ['run', 'format'], {
            cwd: `./${state.name}`,
        });
        command.stderr.pipe(stderr);

        await command;
    };
};
