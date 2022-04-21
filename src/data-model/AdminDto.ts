class AdminDto {
    sequence: number;
    tenantId: number;
    adminType: number;
    name: string;
    password: string;
    surname: string;
    username: string;
    extraInfo: string;
    country: string;

    constructor(seq: number, tenantId: number, type: number, name: string, pswd: string, surname: string, username: string, extraInfo: string, country: string) {
        this.sequence = seq;
        this.tenantId = tenantId;
        this.name  = name;
        this.adminType = type;
        this.password = pswd;
        this.surname = surname;
        this.username = username;
        this.extraInfo = extraInfo;
        this.country = country;
    }
}
export default AdminDto;
