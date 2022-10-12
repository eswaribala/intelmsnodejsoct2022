module.exports = mongoose => {
    var schema = mongoose.Schema(
        {
            accountNo: Number,
            dateOfOpening: String,
            roi: Number,
            balance: Number,
            accountType:String
        },
        { timestamps: true }
    );

    schema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const Account = mongoose.model("account", schema);
    return Account;
};
