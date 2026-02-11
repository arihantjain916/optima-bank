"use client";

import React, { use, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { getCardInfo, getCardnumber } from "@/helper/api/dashboard";
import { BankCard } from "../ui/bankCard";
import moment from "moment";

const CardPage = () => {
  const [cardData, setCardData] = React.useState([
    {
      value: {
        cardholderName: "",
        cardNumber: "",
        expiryMonth: "",
        expiryYear: "",
        cvv: "",
        network: "",
        id: "",
      },
      showVendor: false,
      last4: "",
    },
  ]);
  const [showCardNumber, setShowCardNumber] = React.useState({
    showCardNumber: false,
    selectedCard: "",
    index: 0,
  });
  const [fullCardNumber, setFullCardNumber] = React.useState("");

  useEffect(() => {
    async function initalize() {
      const card = await getCardInfo();
      const formatData = card?.data?.data?.map((item: any) => ({
        value: {
          cardholderName: item?.card_holder_name,
          expiryYear: item?.expiry_year,
          expiryMonth: item?.expiry_month,
          cardNumber: `••• ••• ••• ${item?.last4}`,
          card_type: item?.card_type,
          created_at: moment(new Date()).format("YY/MM"),
          network: item?.network,
          id: item?.id,
        },
        showVendor: true,
        last4: item?.last4,
      }));
      setCardData(formatData);
    }

    initalize();
  }, []);

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts: string[] = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };
  async function fetchCardNumber(id: string, index: number) {
    const card = await getCardnumber(id);
    const allCard = [...cardData];

    allCard[index].value.cardNumber = formatCardNumber(card?.data?.data);

    setCardData(allCard);
  }
  useEffect(() => {
    const isShown = showCardNumber?.showCardNumber;
    const index = showCardNumber?.index;
    const id = showCardNumber?.selectedCard;
    if (isShown) {
      fetchCardNumber(id, index);
    } else {
      const allCard = [...cardData];
      allCard[index].value.cardNumber = `••• ••• ••• ${allCard[index].last4}`;
      setCardData(allCard);
    }
  }, [showCardNumber]);

  return (
    <main className="p-2">
      {/* <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4 mt-2"> */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Card Details</CardTitle>
          <svg
            fill="#ffff"
            width="800px"
            height="800px"
            viewBox="-1.5 0 19 19"
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-muted-foreground"
          >
            <path d="M15.442 14.75v.491H.558v-.49a.476.476 0 0 1 .475-.476h.478a.487.487 0 0 1-.003-.048v-.443a.476.476 0 0 1 .475-.475h.713V7.164H1.508a.554.554 0 0 1-.22-1.063L7.78 3.288a.554.554 0 0 1 .44 0L14.712 6.1a.554.554 0 0 1-.22 1.063h-1.188v6.145h.713a.476.476 0 0 1 .475.475v.443a.443.443 0 0 1-.003.048h.478a.476.476 0 0 1 .475.475zM3.804 13.31h2.058V8.264H3.804zm.377-7.254h7.639L8 4.4zm2.79 2.21v5.043h2.058V8.265zm5.225 5.043V8.265h-2.059v5.044z" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {/* <BankCard value={cardData} /> */}
            {cardData?.length > 0 &&
              cardData?.map((card, index) => (
                <BankCard
                  key={index}
                  index={index}
                  value={card?.value}
                  showVendor={card?.showVendor}
                  setShowCardNumber={setShowCardNumber}
                  showCardNumber={showCardNumber}
                  fullCardNumber={fullCardNumber}
                />
              ))}
          </div>
        </CardContent>
      </Card>
      {/* </div> */}
    </main>
  );
};

export default CardPage;
