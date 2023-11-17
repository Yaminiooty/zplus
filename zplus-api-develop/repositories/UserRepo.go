package repositories

import (
	"context"
	"errors"
	"sec-tool/config"
	"sec-tool/models"
	struct_errors "sec-tool/structs/errors"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type UserRepo struct {
	DatabaseConfig *config.DatabaseConfig
	CollectionRef  *mongo.Collection
}

func NewUserRepo(DatabaseConfig *config.DatabaseConfig, CollectionName string) *UserRepo {
	return &UserRepo{DatabaseConfig: DatabaseConfig, CollectionRef: DatabaseConfig.DatabaseRef.Collection(CollectionName)}
}

func (ur *UserRepo) CreateNewUser(ObjUserModel *models.UserModel) (*mongo.InsertOneResult, error) {
	ObjUserModel.Id = primitive.NewObjectID()
	result, err := ur.CollectionRef.InsertOne(context.TODO(), ObjUserModel)
	if err != nil {
		return nil, struct_errors.InternalServerError{Message: "Error occured during inserting document.", Err: err}
	}
	return result, nil
}

func (ur *UserRepo) FindAll() (*[]models.UserModel, error) {
	var users []models.UserModel
	result, err := ur.CollectionRef.Find(context.TODO(), bson.D{})
	if err != nil {
		return nil, struct_errors.InternalServerError{Message: "Error occured during fetching documents.", Err: err}
	}
	result.All(context.TODO(), &users)
	return &users, nil
}

func (ur *UserRepo) FindById(objectIdHex string) (*models.UserModel, error) {
	objectId, _ := primitive.ObjectIDFromHex(objectIdHex)
	var UserModel models.UserModel
	result := ur.CollectionRef.FindOne(context.TODO(), bson.D{{"_id", objectId}})
	err := result.Decode(&UserModel)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, struct_errors.NotFoundError{Message: "Unable to find document with given Object Id.", Err: nil}
		}
		return nil, struct_errors.InternalServerError{Message: "Error occurred during fetching Document with given Object Id.", Err: result.Err()}
	}
	return &UserModel, nil
}

func (ur *UserRepo) DeleteById(objectIdHex string) error {
	objectId, _ := primitive.ObjectIDFromHex(objectIdHex)
	result, err := ur.CollectionRef.DeleteOne(context.TODO(), bson.D{{"_id", objectId}})
	if err != nil {
		return struct_errors.InternalServerError{Message: "Error Occurred during deleting the user!", Err: err}
	}
	if result.DeletedCount == 0 {
		return struct_errors.NotFoundError{Message: "Unable to find document with given Object Id.", Err: nil}
	}
	return nil
}

func (ur *UserRepo) GetUserWithEmail(email string) (*models.UserModel, error) {
	var UserModel models.UserModel
	result := ur.CollectionRef.FindOne(context.TODO(), bson.M{"email": email})
	err := result.Decode(&UserModel)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, struct_errors.NotFoundError{Message: "Unable to find document with given email.", Err: nil}
		}
		return nil, struct_errors.InternalServerError{Message: "Error occurred during fetching Document with given email.", Err: result.Err()}
	}
	return &UserModel, nil
}

func (ur *UserRepo) CheckUserExistsByEmail(email string) error {
	var UserModel models.UserModel
	result := ur.CollectionRef.FindOne(context.TODO(), bson.M{"email": email})
	err := result.Decode(&UserModel)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil
		}
		return struct_errors.InternalServerError{Message: "Error occurred during fetching Document with given email.", Err: result.Err()}
	}
	return struct_errors.BadRequestError{Message: "User with given email id is already registered.", Err: result.Err()}
}
func (ur *UserRepo) UpdateUserPasswordByEmail(email string, newPassword string) error {
	var UserModel models.UserModel
	result := ur.CollectionRef.FindOne(context.TODO(), bson.M{"email": email})
	err := result.Decode(&UserModel)
	if err != nil {
		return struct_errors.InternalServerError{Message: "Error occurred during fetching Document with given email.", Err: result.Err()}
	}
	updateUserDocument := bson.M{"password": newPassword}
	UserModel.Password = newPassword
	result = ur.CollectionRef.FindOneAndUpdate(context.TODO(), bson.M{"email": email}, bson.M{"$set": updateUserDocument})
	err = result.Decode(&UserModel)
	if err != nil {
		return struct_errors.InternalServerError{Message: "Error occurred during updateing Document for given email.", Err: result.Err()}
	}
	return nil
}

func (ur *UserRepo) UpdateAccountVerificationStatusByEmail(email string) error {
	updateAccountVerificationStatus := bson.M{"accountVerificationStatus": true}
	_, err := ur.CollectionRef.UpdateOne(context.TODO(), bson.M{"email": email}, bson.M{"$set": updateAccountVerificationStatus})
	if err != nil {
		return struct_errors.InternalServerError{Message: "Error occurred during updating Document for given email.", Err: err}
	}
	return nil
}

func (ur *UserRepo) UpdateUserNameByEmail(email, newName string) error {
	nameUpdate := bson.M{"name": newName}
	_, err := ur.CollectionRef.UpdateOne(context.TODO(), bson.M{"email": email}, bson.M{"$set": nameUpdate})
	if err != nil {
		return struct_errors.InternalServerError{Message: "Error occurred during updating Document for given email.", Err: err}
	}
	return nil
}

func (ur *UserRepo) UpdateUserPhoneByEmail(email, newPhone string) error {
	phoneUpdate := bson.M{"phone": newPhone}
	_, err := ur.CollectionRef.UpdateOne(context.TODO(), bson.M{"email": email}, bson.M{"$set": phoneUpdate})
	if err != nil {
		return struct_errors.InternalServerError{Message: "Error occurred during updating Document for given email.", Err: err}
	}
	return nil
}
