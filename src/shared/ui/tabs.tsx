export type TabItem = {
    id: string;
    label: string;
    isActive: boolean;
    select: () => void;
};

/** Mutually exclusive switch; selection logic lives in the controller that builds `items`. */
export function Tabs({ items, label }: { items: TabItem[]; label: string }) {
    return (
        <div className="tabs" role="tablist" aria-label={label}>
            {items.map(item => (
                <button
                    key={item.id}
                    className="tabs__tab"
                    type="button"
                    role="tab"
                    aria-selected={item.isActive}
                    onClick={item.select}
                >
                    {item.label}
                </button>
            ))}
        </div>
    );
}
