const sequelize = require('../bd');
const {DataTypes, INTEGER} = require('sequelize');

const User = sequelize.define('user', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    registrationDate: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: 'USER'
    },
    likeCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    status: {
        type: DataTypes.ENUM('active', 'blocked'),
        allowNull: false,
        defaultValue: 'active'
    },
});

const Review = sequelize.define('review', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    body: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    rating: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    createReview: {
        type: DataTypes.STRING,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    likeCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    }
});

const Product = sequelize.define('product', {
    id: {
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true},
    name: {
        type: DataTypes.STRING, 
        unique: true, 
        allowNull: false
    },
    averageRating: {
        type: DataTypes.DECIMAL(5, 2),
        validate: {
            isDecimal: true,
            min: 0,
            max: 5,
        },
        defaultValue: 0
    },
})

const ReviewProduct = sequelize.define('review_product', {
    reviewId: {
        type: DataTypes.INTEGER,
        references: {
            model: Review, 
            key: 'id'
        }
    },
    productId: {
        type: DataTypes.INTEGER,
        references: {
            model: Product, 
            key: 'id'
        }   
    }
})

const Type = sequelize.define('type', {
    id: {
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true},
    name: {
        type: DataTypes.STRING, 
        unique: true, 
        allowNull: false},
})
const ReviewType = sequelize.define('review_type', {
    reviewId: {
        type: DataTypes.INTEGER,
        references: {
            model: Review, 
            key: 'id'
        }
    },
    typeId: {
        type: DataTypes.INTEGER,
        references: {
            model: Type, 
            key: 'id'
        }   
    }
  });

const Tag = sequelize.define('tag', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,  
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
});

const ReviewTag = sequelize.define('review_tag', {
    reviewId: {
        type: DataTypes.INTEGER,
        references: {
            model: Review, 
            key: 'id'
        }
    },
    tagId: {
        type: DataTypes.INTEGER,
        references: {
            model: Tag, 
            key: 'id'
        }   
    }
  });

const Image = sequelize.define('image', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,  
    },
    nameFile: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    pathToCloudStorage: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});

const ReviewImage = sequelize.define('review_image', {
    reviewId: {
        type: DataTypes.INTEGER,
        references: {
            model: Review, 
            key: 'id'
        }
    },
    imageId: {
        type: DataTypes.INTEGER,
        references: {
            model: Image, 
            key: 'id'
        }   
    }

  });

const Comment = sequelize.define('comment', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,  
    },
    body: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    createComment: {
        type: DataTypes.STRING,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    userName: {
        type: DataTypes.STRING,
    },
    reviewId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

const Rating = sequelize.define('rating', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,  
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    dateCreate: {
        type: DataTypes.DATE,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

const SocialNetwork = sequelize.define('socialNetwork', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,  
    },
    nameSocial: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

const Like = sequelize.define('like', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
});

Like.belongsTo(User, { foreignKey: 'userId' });
Like.belongsTo(Review, { foreignKey: 'reviewId' });

User.hasMany(Like, { foreignKey: 'userId' });
Review.hasMany(Like, { foreignKey: 'reviewId' });

Review.belongsTo(User, {foreignKey: 'userId'});
User.hasMany(Review, {foreignKey: 'userId'});

Review.belongsToMany(Product, { through: ReviewProduct });
Product.belongsToMany(Review, { through: ReviewProduct });

Review.belongsToMany(Type, { through: ReviewType });
Type.belongsToMany(Review, { through: ReviewType });

Review.belongsToMany(Tag, { through: ReviewTag});
Tag.belongsToMany(Review, { through: ReviewTag});

Review.belongsToMany(Image, { through: ReviewImage });
Image.belongsToMany(Review, { through: ReviewImage });

User.hasMany(Comment, { foreignKey: 'userId' });
Review.hasMany(Comment, { foreignKey: 'reviewId' });


Product.hasMany(Rating);
Rating.belongsTo(Product);

User.hasMany(SocialNetwork, { foreignKey: 'userId' });
SocialNetwork.hasMany(User, { foreignKey: 'userId' });

module.exports = {
    User,
    Review,
    Type,
    Tag,
    ReviewTag,
    Image,
    ReviewImage,
    Comment,
    Rating,
    SocialNetwork,
    Like,
    Product
}