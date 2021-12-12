class UserDto {
    sequence: number;
    tenantId: number;
    name: string;
    surname: string;
    insuranceNumber: string;
    email: string;
    password: string;
    regionSequence: number;
    districtSequence: number;
    villageSequence: number;
    roles: string[];

    constructor(sequence: number, tenantId: number, name: string, surname: string, insuNumber: string, email: string, password: string, regionSeq: number,
                districtSequence: number, villageSequence: number, roles: string[]) {
        this.sequence = sequence;
        this.tenantId = tenantId;
        this.name = name;
        this.surname = surname;
        this.insuranceNumber = insuNumber;
        this.email = email;
        this.password = password;
        this.regionSequence = regionSeq;
        this.districtSequence = districtSequence;
        this.villageSequence = villageSequence;
        this.roles = roles;
    }

     static of(): UserDto {
        return new UserDto(0, 0, '', '', '', '', '', 0, 0, 0, []);
    }
}

export default UserDto;
