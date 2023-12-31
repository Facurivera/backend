import { Faker } from "@faker-js/faker";

export const generateMockProduct = () => {
    let product = {
        _id: Faker.database.mongodbObjectId(),
        code: Faker.string.alphanumeric(7),
        title: Faker.commerce.productName(),
        description: Faker.commerce.productDescription(),
        price: parseInt(Faker.string.numeric(3)),
        stock: parseInt(Faker.string.numeric(2)),
        category: Faker.commerce.department(),
        thumbnail: Faker.image.url()
    }
    product.available = product.stock > 0 ? true : false;
    return product;
};