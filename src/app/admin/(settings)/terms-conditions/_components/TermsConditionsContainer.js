"use client";

import FormWrapper from "@/components/Form/FormWrapper";
import UTextEditor from "@/components/Form/UTextEditor";
import { Button } from "antd";
import { Edit } from "lucide-react";

export default function TermsConditionsContainer() {
  return (
    <section>
      <h3 className="text-2xl font-semibold mb-6">Terms and Conditions</h3>

      <FormWrapper>
        <UTextEditor
          name="privacyPolicy"
          placeholder="Note: Enter details about your terms and conditions here."
        />

        <Button
          type="primary"
          size="large"
          className="w-full rounded-xl"
          icon={<Edit size={18} />}
        >
          Save Changes
        </Button>
      </FormWrapper>
    </section>
  );
}
