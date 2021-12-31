class UserDto {
    sequence: number;
    tenantId: number;
    country: string;
    name: string;
    surname: string;
    insuranceNumber: string;
    email: string;
    password: string;
    regionSequence: number;
    region: string;
    districtSequence: number;
    district: string;
    villageSequence: number;
    village: string;
    dateOfBirth: string;  //DD.MM.YYYY
    phoneNumber: string;
    extraInfo: string;
    roles: string[];

    constructor(sequence: number, tenantId: number, country: string, name: string, surname: string, insuNumber: string, email: string, password: string, regionSeq: number,
                region: string, districtSequence: number, district: string, villageSequence: number, village: string, dateOfBirth: string, phone: string, extraInfo: string, roles: string[]) {
        this.sequence = sequence;
        this.tenantId = tenantId;
        this.country = country;
        this.name = name;
        this.surname = surname;
        this.insuranceNumber = insuNumber;
        this.email = email;
        this.password = password;
        this.regionSequence = regionSeq;
        this.region = region;
        this.districtSequence = districtSequence;
        this.district = district;
        this.villageSequence = villageSequence;
        this.village = village;
        this.dateOfBirth = dateOfBirth;
        this.phoneNumber = phone;
        this.extraInfo = extraInfo;
        this.roles = roles;
    }

     static of(): UserDto {
        return new UserDto(0, 0, '', '', '', '',
            '', '',0,'', 0, '',0,'', '','','',[]);
    }
}

export default UserDto;
