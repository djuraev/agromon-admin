import Name from './Name';

class DistrictDto {
    sequence: number;
    tenantId: number;
    country: string;
    regionSequence: number;
    regionName: string;
    name: string;
    names: Name[];

    constructor(sequence: number, tenantId: number, country: string, regSeq: number, regionName: string, name: string, names: Name[]) {
        this.sequence = sequence;
        this.tenantId = tenantId;
        this.country = country;
        this.regionSequence = regSeq;
        this.regionName = regionName;
        this.name = name;
        this.names = names;
    }
}

export default DistrictDto;
