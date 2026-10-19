import 'reflect-metadata';
import { configure } from 'mobx';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AppView } from '~/app/app.view';
import { appConfig } from '~/shared/config';
import { ContainerProvider } from '~/shared/di/container';
import './styles.css';

configure({ enforceActions: 'always' });

// fail fast when .env is missing
void appConfig.apiBase;

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ContainerProvider>
            <AppView />
        </ContainerProvider>
    </StrictMode>,
);
