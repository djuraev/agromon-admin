import Name from './Name';

class RegionDto {
    sequence: number;
    tenantId: number;
    name: string;
    names: Name[];

    constructor(id: number, tenantId: number, name: string, names: Name[]) {
        this.sequence = id;
        this.tenantId = tenantId;
        this.name = name;
        this.names = names;
    }
}

export default RegionDto;
