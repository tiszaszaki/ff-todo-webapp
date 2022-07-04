export class PivotResponse {
    public fields!: Set<{key: string, value: string}>;
    public fieldDisplay!: Set<{key: string, value: string}>;
    public fieldOrder!: string[];
    public records = [];
}
