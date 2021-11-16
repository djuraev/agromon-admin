class TenantDto {
    id: number;
    country: string;
    code: string;
    names: Name[];

    constructor(id: number, contry: string, code: string, names: Name[]) {
        this.id = id;
        this.country = contry;
        this.code = code;
        this.names = names;
    }

    addName(name: Name) {
        this.names.push(name);
    }

}

class Name {
    langCode: string;
    name: string;

    constructor(langCode: string, name: string) {
        this.langCode = langCode;
        this.name = name;
    }
}
export default TenantDto;
