class AccountDto {
    public tenantId: number = 0;
    public name: string = "";
    public surname: string = "";
    public username: string = "";
    public password: string = "";
    public adminType: string = "";

    public static sample() : AccountDto {
        return new AccountDto();
    }
}

export default AccountDto;
