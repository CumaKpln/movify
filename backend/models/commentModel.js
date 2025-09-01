const { DataTypes } = require("sequelize");
const sequelize = require("../db");

// Comment modeli tanımı
const Comment = sequelize.define(
  "comment",
  {
    // Yorum metni, boş bırakılamaz
    text: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    // Yorumun hangi filme ait olduğunu belirtir
    movieId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "movies", // Bağlı olduğu tablo
        key: "id",
      },
      onDelete: "CASCADE", // Film silindiğinde yorumlar da silinir
      onUpdate: "CASCADE",
    },

    // Yorum yapan kullanıcı
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users", // Bağlı olduğu tablo
        key: "id",
      },
      onDelete: "CASCADE", // Kullanıcı silinirse yorumlar da silinir
      onUpdate: "CASCADE",
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    // Oluşturulma ve güncellenme tarihleri otomatik eklenir
    timestamps: true,
  }
);

module.exports = Comment;
