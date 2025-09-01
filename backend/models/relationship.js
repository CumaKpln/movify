const Movie = require("./movieModel");
const Comment = require("./commentModel");
const Category = require("./categoryModel");
const Actor = require("./actorModel");
const User = require("./userModel");
const Favorite = require("./favoriteModel");
const Movies_actors = require("./movies_actors");

// Film <-> Yorum (One-to-Many)
{
  Movie.hasMany(Comment, { foreignKey: "movieId", onDelete: "CASCADE" });
  Comment.belongsTo(Movie, { foreignKey: "movieId" });
}

// User <-> Yorum
{
  User.hasMany(Comment, { foreignKey: "userId", onDelete: "CASCADE" });
  Comment.belongsTo(User, { foreignKey: "userId" });
}

// Film <-> Kategori (one-to-many)
{
  Category.hasMany(Movie, { foreignKey: "categoryId", onDelete: "CASCADE" });
  Movie.belongsTo(Category, {
    foreignKey: "categoryId",
    as: "categoryInfo",
    onDelete: "CASCADE",
  });
}

// Film <-> Oyuncu (Many-to-Many)
{
  Movie.belongsToMany(Actor, {
    through: Movies_actors,
    foreignKey: "movieId",
    otherKey: "actorId",
    onDelete: "CASCADE",
  });
  Actor.belongsToMany(Movie, {
    through: Movies_actors,
    foreignKey: "actorId",
    otherKey: "movieId",
    onDelete: "CASCADE",
  });
}

// Kullanıcı <-> Film (One-to-Many)
{
  User.hasMany(Movie, { foreignKey: "userId", onDelete: "CASCADE" });
  Movie.belongsTo(User, {
    foreignKey: "userId",
    as: "userInfo",
    onDelete: "CASCADE",
  });
}

// Kullanıcı <-> Favori Filmler (Many-to-Many)
{
  User.belongsToMany(Movie, {
    through: Favorite,
    foreignKey: "userId",
    otherKey: "movieId",
    as: "favoriteMovies",
    onDelete: "CASCADE",
  });
  Movie.belongsToMany(User, {
    through: Favorite,
    foreignKey: "movieId",
    otherKey: "userId",
    as: "favoritedByUsers",
    onDelete: "CASCADE",
  });
}

module.exports = {
  Movie,
  Category,
  Comment,
  Actor,
  User,
  Favorite,
  Movies_actors,
};
