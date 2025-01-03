"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Form, FormControl } from "@/components/ui/form"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { PatientFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { registerPatient } from "@/lib/actions/patient.actions"
import { FormFieldType } from "./PatientForm"
import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group"
import { Doctors, GenderOptions, IdentificationTypes, PatientFormDefaultValues } from "@/constants"

import { SelectItem } from "../ui/select"
import Image from "next/image"
import FileUploader from "../FileUploader"
import { Label } from "../ui/label"

const RegisterForm = ({ user }: { user: User }) => {
    const router = useRouter();

    // Define isLoading.
    const [isLoading, setIsLoading] = useState(false);

    // 1. Define your form.
    const form = useForm<z.infer<typeof PatientFormValidation>>({
        resolver: zodResolver(PatientFormValidation),
        defaultValues: {
            ...PatientFormDefaultValues,
            name: "",
            email: "",
            phone: "",
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof PatientFormValidation>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        setIsLoading(true);

        // Object that stores files.
        let formData;

        // If we have an actual file:
        if (values.identificationDocument && values.identificationDocument.length > 0) {
            const blobFile = new Blob([values.identificationDocument[0]], {
                type: values.identificationDocument[0].type,
            })

            // Save file.
            formData = new FormData();
            formData.append('blobFile', blobFile);
            formData.append('filename', values.identificationDocument[0].name);
        }

        try {
            const patient = {
                userId: user.$id,
                name: values.name,
                email: values.email,
                phone: values.phone,
                birthDate: new Date(values.birthDate),
                gender: values.gender,
                address: values.address,
                occupation: values.occupation,
                emergencyContactName: values.emergencyContactName,
                emergencyContactNumber: values.emergencyContactNumber,
                primaryPhysician: values.primaryPhysician,
                insuranceProvider: values.insuranceProvider,
                insurancePolicyNumber: values.insurancePolicyNumber,
                allergies: values.allergies,
                currentMedication: values.currentMedication,
                familyMedicalHistory: values.familyMedicalHistory,
                pastMedicalHistory: values.pastMedicalHistory,
                identificationType: values.identificationType,
                identificationNumber: values.identificationNumber,
                identificationDocument: values.identificationDocument
                  ? formData
                  : undefined,
                privacyConsent: values.privacyConsent,
              };

            const newPatient = await registerPatient(patient);

            if (newPatient) {router.push(`/patients/${user.$id}/new-appointment`)}
        } catch (error) {
            console.log(error);
        }

        setIsLoading(false)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 flex-1">
                
                {/* Header. */}
                <section className="space-y-4">
                    <h1 className="header">Welcome</h1>
                    <p className="text-dark-700">Let us know more about yourself.</p>
                </section>

                {/* Sub Header. */}
                <section className="space-y-6">
                    <div className="mb-9 space-y-1">
                        <h2 className="sub-header">Personal Information</h2>
                    </div>
                </section>

                {/* Name input. */}
                <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="name"
                    label="Full Name"
                    placeholder="John"
                    iconSrc="/assets/icons/user.svg"
                    iconAlt="user"
                />

                <div className="flex flex-col gap-6 xl:flex-row">
                    {/* Email input. */}
                    <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        control={form.control}
                        name="email"
                        label="Email"
                        placeholder="john@gmail.com"
                        iconSrc="/assets/icons/email.svg"
                        iconAlt="email"
                    />

                    {/* Phone input. */}
                    <CustomFormField
                        fieldType={FormFieldType.PHONE_INPUT}
                        control={form.control}
                        name="phone"
                        label="Phone Number"
                        placeholder="(555) 123-6789"
                    />
                </div>

                <div className="flex flex-col gap-6 xl:flex-row">
                    {/* Date input. */}
                    <CustomFormField
                        fieldType={FormFieldType.DATE_PICKER}
                        control={form.control}
                        name="birthdate"
                        label="Date of Birth"
                    />

                    {/* Gender input. */}
                    <CustomFormField
                        fieldType={FormFieldType.SKELETON}
                        control={form.control}
                        name="gender"
                        label="Gender"
                        renderSkeleton={(field) => (
                            <FormControl>
                                <RadioGroup
                                    className="flex h-11 gap-6 xl:justify-between"
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}>
                                    {GenderOptions.map((option, i) => (
                                        <div key={option + i} className="radio-group">
                                            <RadioGroupItem value={option} id={option} />
                                            <Label htmlFor={option} className="cursor-pointer">
                                                {option}
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </FormControl>
                        )}
                    />
                </div>

                <div className="flex flex-col gap-6 xl:flex-row">
                    {/* Address input. */}
                    <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        control={form.control}
                        name="address"
                        label="Address"
                        placeholder="14st, New York"
                    />

                    {/* Occepation input. */}
                    <CustomFormField
                        fieldType={FormFieldType.PHONE_INPUT}
                        control={form.control}
                        name="occupation"
                        label="Occupation"
                        placeholder="Job Position"
                    />
                </div>

                <div className="flex flex-col gap-6 xl:flex-row">
                    {/* Emergency Contact Person input. */}
                    <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        control={form.control}
                        name="emergencyContactName"
                        label="Emergency Contact Name"
                        placeholder="Gardian's name"
                    />

                    {/* Emergency Contact Phone Number input. */}
                    <CustomFormField
                        fieldType={FormFieldType.PHONE_INPUT}
                        control={form.control}
                        name="emergencyContactNumber"
                        label="Emergency Contact Number"
                        placeholder="(555) 123-6789"
                    />
                </div>

                {/* Sub Header. */}
                <section className="space-y-6">
                    <div className="mb-9 space-y-1">
                        <h2 className="sub-header">Medical Information</h2>
                    </div>
                </section>
                
                {/* Physician Selector. */}
                <CustomFormField
                    fieldType={FormFieldType.SELECT}
                    control={form.control}
                    name="primaryPhysician"
                    label="Primary Physician"
                    placeholder="Select a physician"
                >
                    {Doctors.map((doctor) => (
                        <SelectItem key={doctor.name} value={doctor.name}>
                            <div className="flex cursor-pointer items-center gap-2">
                                <Image
                                    src={doctor.image}
                                    width={32}
                                    height={32}
                                    alt={doctor.name}
                                    className="rounded-full border border-dark-500"
                                />
                                <p>{doctor.name}</p>
                            </div>
                        </SelectItem>
                    ))}
                </CustomFormField>

                <div className="flex flex-col gap-6 xl:flex-row">
                    {/* Insurance Provider. */}
                    <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        control={form.control}
                        name="insuranceProvider"
                        label="Insurance Provider"
                        placeholder="BlueCross BlueShield"
                    />

                    {/* Insurance Policy Number. */}
                    <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        control={form.control}
                        name="insurancePolicyNumber"
                        label="Insurance Policy Number"
                        placeholder="ABC123456789"
                    />
                </div>

                <div className="flex flex-col gap-6 xl:flex-row">
                    {/* Allergies. */}
                    <CustomFormField
                        fieldType={FormFieldType.TEXTAREA}
                        control={form.control}
                        name="allergies"
                        label="Allergies (if any)"
                        placeholder="Peanuts, Penicillin, Pollen"
                    />

                    {/* Current Medication. */}
                    <CustomFormField
                        fieldType={FormFieldType.TEXTAREA}
                        control={form.control}
                        name="currentMedication"
                        label="Current Medication (if any)"
                        placeholder="Ibuprofen 200mg, Paracetamol 500mg"
                    />
                </div>

                <div className="flex flex-col gap-6 xl:flex-row">
                    {/* Family Medical History. */}
                    <CustomFormField
                        fieldType={FormFieldType.TEXTAREA}
                        control={form.control}
                        name="familyMedicalHistory"
                        label="Family Medical History"
                        placeholder="Mother had brain cancer"
                    />

                    {/* Past Medical History. */}
                    <CustomFormField
                        fieldType={FormFieldType.TEXTAREA}
                        control={form.control}
                        name="pastMedicalHistory"
                        label="Past Medical History"
                        placeholder="Appendectomy, Tonsillectomy"
                    />
                </div>

                {/* Sub Header. */}
                <section className="space-y-6">
                    <div className="mb-9 space-y-1">
                        <h2 className="sub-header">Identification and Verification</h2>
                    </div>
                </section>

                {/* Identification Type Selector. */}
                <CustomFormField
                    fieldType={FormFieldType.SELECT}
                    control={form.control}
                    name="identificationType"
                    label="Identification Type"
                    placeholder="Select an Identification Type"
                >
                    {IdentificationTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                            {type}
                        </SelectItem>
                    ))}
                </CustomFormField>

                {/* Identification Number input. */}
                <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="identificationNumber"
                    label="Identification Number"
                    placeholder="123456789"
                />


                {/* Identification Document input. */}
                <CustomFormField
                    fieldType={FormFieldType.SKELETON}
                    control={form.control}
                    name="identificationDocument"
                    label="Scanned copy of identification document"
                    renderSkeleton={(field) => (
                        <FormControl>
                            <FileUploader files={field.value} onChange={field.onChange} />
                        </FormControl>
                    )}
                />

                {/* Sub Header. */}
                <section className="space-y-6">
                    <div className="mb-9 space-y-1">
                        <h2 className="sub-header">Consent and Privacy</h2>
                    </div>
                </section>
                
                {/* Checkboxes. */}
                <CustomFormField
                    fieldType={FormFieldType.CHECKBOX}
                    control={form.control}
                    name="treatmentConsent"
                    label="I consent to treatment."
                />

                <CustomFormField
                    fieldType={FormFieldType.CHECKBOX}
                    control={form.control}
                    name="disclosureConsent"
                    label="I consent to disclosure of information."
                />

                <CustomFormField
                    fieldType={FormFieldType.CHECKBOX}
                    control={form.control}
                    name="privacyConsent"
                    label="I consent to privacy policy."
                />

                <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
            </form>
        </Form>
    )
}

export default RegisterForm;