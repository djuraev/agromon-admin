class PostResult {
    result: string = '';
    entity: object = {};
    message: string = '';

    public static sample(): PostResult {
        return new PostResult();
    }
}
export default PostResult;
