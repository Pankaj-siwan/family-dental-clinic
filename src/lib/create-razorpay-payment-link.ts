import type { NextApiRequest, NextApiResponse } from "next";

type RegistrationFee = 200 | 300 | 500;

type PaymentLinkRequest = {
  appointmentId?: string;
  patientName?: string;
  mobile?: string;
  clinicName?: string;
  appointmentDate?: string;
  appointmentTime?: string;
  registrationFee?: RegistrationFee;
};

type SuccessResponse = {
  paymentLinkId: string;
  paymentUrl: string;
  paymentStatus: string;
};

type ErrorResponse = {
  message: string;
};

function normaliseIndianMobile(value: string) {
  const digits = value.replace(/\D/g, "").slice(-10);

  if (digits.length !== 10) {
    throw new Error("Enter a valid 10-digit Indian mobile number.");
  }

  return `+91${digits}`;
}

function makeReferenceId(appointmentId: string) {
  const safeId = appointmentId.replace(/[^a-zA-Z0-9_-]/g, "");
  const suffix = Date.now().toString(36);
  return `${safeId.slice(0, 40 - suffix.length - 1)}-${suffix}`;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse | ErrorResponse>,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method not allowed." });
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return res.status(500).json({
      message:
        "Razorpay is not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env.local.",
    });
  }

  const body = req.body as PaymentLinkRequest;
  const fee = Number(body.registrationFee);

  if (
    !body.appointmentId ||
    !body.patientName ||
    !body.mobile ||
    !body.clinicName ||
    !body.appointmentDate ||
    !body.appointmentTime
  ) {
    return res.status(400).json({
      message: "Required appointment details are missing.",
    });
  }

  if (![200, 300, 500].includes(fee)) {
    return res.status(400).json({
      message: "Registration fee must be ₹200, ₹300, or ₹500.",
    });
  }

  try {
    const contact = normaliseIndianMobile(body.mobile);
    const callbackUrl =
      process.env.RAZORPAY_CALLBACK_URL?.trim() || undefined;

    const razorpayBody: Record<string, unknown> = {
      amount: fee * 100,
      currency: "INR",
      accept_partial: false,
      reference_id: makeReferenceId(body.appointmentId),
      description: `Registration fee for ${body.clinicName}`,
      customer: {
        name: body.patientName.trim(),
        contact,
      },
      notify: {
        sms: true,
        email: false,
      },
      reminder_enable: true,
      notes: {
        appointment_id: body.appointmentId,
        clinic_name: body.clinicName.slice(0, 256),
        appointment_date: body.appointmentDate,
        appointment_time: body.appointmentTime,
        registration_fee: String(fee),
      },
    };

    if (callbackUrl) {
      razorpayBody.callback_url = callbackUrl;
      razorpayBody.callback_method = "get";
    }

    const authorization = Buffer.from(`${keyId}:${keySecret}`).toString(
      "base64",
    );

    const razorpayResponse = await fetch(
      "https://api.razorpay.com/v1/payment_links",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${authorization}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(razorpayBody),
      },
    );

    const result = await razorpayResponse.json().catch(() => null);

    if (!razorpayResponse.ok) {
      const description =
        result?.error?.description ||
        result?.error?.reason ||
        "Razorpay rejected the payment-link request.";

      return res.status(razorpayResponse.status).json({
        message: description,
      });
    }

    return res.status(200).json({
      paymentLinkId: result.id,
      paymentUrl: result.short_url,
      paymentStatus: result.status || "created",
    });
  } catch (error) {
    return res.status(500).json({
      message:
        error instanceof Error
          ? error.message
          : "The payment link could not be created.",
    });
  }
}
