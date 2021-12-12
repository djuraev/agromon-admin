

class CropDto {
    //
    sequence: number;
    name: string;
    extraInfo: string;
    code: string;

    constructor(seq: number, name: string, extraInfo: string, code: string) {
        this.sequence = seq;
        this.name = name;
        this.extraInfo = extraInfo;
        this.code = code;
    }

    static of(): CropDto {
        return new CropDto(0, '', '','');
    }
}
export default CropDto;
