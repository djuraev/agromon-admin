class ClaimDto {
    //
    sequence: number;
    username: string;
    fieldId: number;
    fieldName: string;
    cropType: string;
    areaTon: string;
    farmerName: string;
    farmerPhone: string;
    description: string;
    status: string;
    date: string;

    constructor(sequence: number, username: string, fieldId: number, fieldName: string, cropType: string, areaTon: string, farmerName: string, phone: string, desc: string, status: string, date: string) {
        //
        this.sequence = sequence;
        this.username = username;
        this.fieldId = fieldId;
        this.fieldName = fieldName;
        this.cropType = cropType;
        this.areaTon = areaTon;
        this.farmerName = farmerName;
        this.farmerPhone = phone;
        this.description = desc;
        this.status = status;
        this.date = date;
    }

    public static sample() : ClaimDto {
        return new ClaimDto(0,'',0,'','','','','','','','');
    }
}

export default ClaimDto;
