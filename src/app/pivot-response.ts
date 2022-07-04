export class PivotResponse {
    public fields!: Set<{key: string, value: string}>;
    public fieldOrder!: string[];
    public records = [];
}
