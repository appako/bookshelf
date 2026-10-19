import { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react';
import { container, type DependencyContainer, type InjectionToken } from 'tsyringe';
import type { Controller } from '~/shared/mobx/controller.base';

const ContainerContext = createContext<DependencyContainer>(container);

export function ContainerProvider({ value = container, children }: PropsWithChildren<{ value?: DependencyContainer }>) {
    return <ContainerContext.Provider value={value}>{children}</ContainerContext.Provider>;
}

export function useController<T extends Controller>(token: InjectionToken<T>): T {
    const di = useContext(ContainerContext);
    const [controller] = useState(() => di.resolve(token));
    useEffect(() => {
        controller.init();
        return () => controller.dispose();
    }, [controller]);
    return controller;
}
