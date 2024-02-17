import { FC, ReactNode } from 'react';

import styles from './SoftPanel.module.scss';

type ViewProps = {
    children: ReactNode;
};

export const SoftPanel: FC<ViewProps> = ({ children }) => {
    return <div className={styles.root}>{children}</div>;
};
