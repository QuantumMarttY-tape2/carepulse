"use server";

import { ID, Query } from "node-appwrite";
import {
    BUCKET_ID,
    DATABASE_ID,
    databases,
    storage,
    ENDPOINT,
    PATIENT_COLLECTION_ID,
    PROJECT_ID,
    users } from "../appwrite.config"
import { parseStringify } from "../utils"

import { InputFile } from "node-appwrite/file"

export const createUser = async (user: CreateUserParams) => {
    try{
        const newUser = await users.create(
            ID.unique(),
            user.email,
            user.phone,
            // Password is undefined here.
            undefined,
            user.name)

        return parseStringify(newUser);
    } catch (error: any) {
        // If the user already exists.
        if (error && error?.code === 409) {
            const documents = await users.list([
                Query.equal('email', [user.email])
            ])

            return documents?.users[0]
        }

        console.error("An error occurred while creating a new user:", error);
    }
}

// If the user is already registered:
export const getUser = async (userId: string) => {
    try {
        const user = await users.get(userId);

        return parseStringify(user);
    } catch (error) {
        console.log(error)
    }
}
export const getPatient = async (userId: string) => {
    try {
        const patients = await databases.listDocuments(
            DATABASE_ID!,
            PATIENT_COLLECTION_ID!,
            [Query.equal('userId', userId)]
        );

        return parseStringify(patients.documents[0]);
    } catch (error) {
        console.log(error)
    }
}

export const registerPatient = async ({ identificationDocument, ...patient }: RegisterUserParams) => {
    try {
        // Use appwrite stroage to upload files.
        let file;

        if (identificationDocument) {
            const inputFile = identificationDocument && InputFile.fromBuffer(
                identificationDocument?.get('blobFile') as Blob,
                identificationDocument?.get('fileName') as string,
            )

            file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile)
        }

        // Create new patient in the database.
        const newPatient = await databases.createDocument(
            DATABASE_ID!,
            PATIENT_COLLECTION_ID!,
            ID.unique(),
            {
                identificationDocumentId: file?.$id || null,
                identificationDocumentUrl: `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file?.$id}/view?project=${PROJECT_ID}`,
                ...patient
            }
        )

        return parseStringify(newPatient)
    } catch(error) {
        console.log(error)
    }
}