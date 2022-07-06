export interface PivotKeyValuePair
{
    key: string;
    value: string;
}

export class PivotResponse {
    public fields!: Set<PivotKeyValuePair>;
    public fieldDisplay!: Set<PivotKeyValuePair>;
    public fieldOrder!: string[];
    public records!: any[];
}
