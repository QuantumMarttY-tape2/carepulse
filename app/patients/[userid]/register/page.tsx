import RegisterForm from "@/components/forms/RegisterForm";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import * as Sentry from '@sentry/nextjs';
import { getUser } from "@/lib/actions/patient.actions";

const Register = async ({ params: { userId } }: SearchParamProps) => {
    const user = await getUser(userId);

    // Sentry (app) metrics.
    Sentry.metrics.set("user_view_register", user.name);

    return (
        // Registration interface.
        <div className="flex h-screen max-h-screen">
            <section className="remove-scrollbar container">
                <div className="sub-container max-w-[860px] flex-1 flex-col py-10">

                    {/* Logo. */}
                    <Image
                        src="./assets/icons/logo-full.svg"
                        height={1000}
                        width={1000}
                        alt="patient"
                        className="mb-12 h-10 w-fit"
                    />

                    {/* Patient form to fill. */}
                    <RegisterForm user={user} />

                    {/* Copyright sign. */}
                    <p className="copyright py-12">
                        &copy; 2024 CarePulse
                    </p>
                </div>
            </section>

            {/* Decorative image on the registration interface. */}
            <Image
                src="/assets/images/register-img.png"
                height={1000}
                width={1000}
                alt="patient"
                className="side-img max-w-[390px]"
            />
        </div>
    );
}

export default Register;