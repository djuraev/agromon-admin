import Name from './Name';

class DistrictDto {
    sequence: number;
    tenantId: number;
    regionSequence: number;
    name: string;
    names: Name[];

    constructor(sequence: number, tenantId: number, regSeq: number, name: string, names: Name[]) {
        this.sequence = sequence;
        this.tenantId = tenantId;
        this.regionSequence = regSeq;
        this.name = name;
        this.names = names;
    }
}

export default DistrictDto;
