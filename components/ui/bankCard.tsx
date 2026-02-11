"use client";

import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import {
  CreditCard as CreditCardIcon,
  Eye,
  EyeOff,
  Lock,
  LockOpen,
} from "lucide-react";

// Enhanced Card vendor SVG icons with better styling
const CardIcons = {
  visa: (
    <svg viewBox="0 0 40 24" className="w-10 h-6">
      <rect width="40" height="24" rx="4" fill="#1A1F71" />
      <text
        x="20"
        y="15"
        textAnchor="middle"
        fill="white"
        fontSize="8"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
      >
        VISA
      </text>
    </svg>
  ),
  mastercard: (
    <svg viewBox="0 0 40 24" className="w-10 h-6">
      <rect width="40" height="24" rx="4" fill="#000" />
      <circle cx="15" cy="12" r="7" fill="#EB001B" />
      <circle cx="25" cy="12" r="7" fill="#FF5F00" />
    </svg>
  ),
  rupay: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 333334 199007"
      shape-rendering="geometricPrecision"
      text-rendering="geometricPrecision"
      image-rendering="optimizeQuality"
      fill-rule="evenodd"
      clip-rule="evenodd"
    >
      <path
        d="M214088 83928h13199v20970l11418-20970h12113l-24422 42395s-2267 3556-5079 5437c-2310 1547-5151 1477-6019 1540-4824-42-10643-55-10643-55l2807-10106 4542-8s2079-212 2882-1237c765-977 1156-1954 1156-3387 0-2148-1954-34580-1954-34580zM76939 88116c-1837 4256-7533 3772-7533 3772l-6632-31 2421-9013s5933 22 8843 22c3115 0 4088 2502 2902 5249zm15073-6142c1129-8943-6741-11201-15250-11201H54402l-13199 48105h14208l4436-16333 7970 65s3289-191 3354 2898c69 3295-2442 9345-2280 13370h14596l-32-1281s-1213-322-1078-2026c56-709 839-2953 1864-5979 618-1334 1550-4499 1464-7076-107-3217-2126-4710-5037-5754 9074-2128 11342-14787 11343-14787zm3224 1954h12959l-5337 20533s-1331 4579 2952 4932c3384 280 5902-3758 6727-6493 1084-3592 5296-18973 5296-18973h13351l-10159 34950h-11657l1432-4993s-5947 7252-14783 6382c-7854-771-8531-6468-7170-13575 668-3489 6389-22763 6389-22763zm66557 4298c-1849 5158-6944 4550-6944 4550l-6956 2 2746-10220s4403 23 7311 23c3560 0 4852 2828 3843 5644zm14609-4776c1130-8944-5687-12678-14197-12678h-22359l-13198 48105h14208l3995-14831 11320 69s17530 742 20232-20665zm11945 28307c-2220 563-4912 869-5446-1148-1466-5527 11474-7145 11474-7145 88 5036-4325 7859-6029 8293zm19575-10116c1707-5814 3865-11319 2128-14370-2660-4670-7468-5080-14502-5080-7771 0-17365 1476-20492 11810h12937s1179-3892 6035-3647c4298 217 4063 3174 2479 4809-2778 2865-10450 1276-18947 4224-7424 2576-10022 12338-8409 16234 1563 3778 4474 4259 8401 4645 6307 620 11143-2897 13394-4961 0 2292 60 3572 60 3572h13614l-33-1281s-1213-322-1078-2026c98-1248 2450-7252 4412-13929z"
        fill="#382a8d"
      />
      <path fill="#1d8546" d="M267751 75852l-15239 53011 28524-26506z" />
      <path fill="#ec6b00" d="M257982 75852l-15239 53011 28525-26506z" />
      <path d="M286355 66228c-2896 0-5254 2357-5254 5254 0 2896 2357 5253 5254 5253 2896 0 5253-2357 5253-5253 0-2898-2357-5254-5253-5254zm-81 7409v-4095h817l968 2899c90 270 154 472 197 606 46-149 118-368 218-657l980-2848h728v4095h-522v-3428l-1190 3428h-488l-1185-3486v3486h-523zm-2721 0v-3611h-1348v-483h3245v483h-1354v3611h-543zm2802 3618c-3185 0-5774-2590-5774-5774s2590-5775 5774-5775c3183 0 5774 2591 5774 5775 0 3183-2591 5774-5774 5774z" />
      <path
        d="M31367 0h270601c8631 0 16474 3528 22156 9210 5683 5683 9211 13526 9211 22156v136275c0 8629-3529 16472-9211 22155-5683 5682-13526 9211-22155 9211H31368c-8629 0-16473-3528-22156-9211C3530 184114 2 176272 2 167641V31366c0-8631 3528-16474 9210-22156S22738 0 31369 0zm270601 10811H31367c-5647 0-10785 2315-14513 6043s-6043 8866-6043 14513v136275c0 5646 2315 10784 6043 14512 3729 3729 8867 6044 14513 6044h270601c5645 0 10783-2315 14512-6044 3728-3729 6044-8867 6044-14511V31368c0-5645-2315-10784-6043-14513-3728-3728-8867-6043-14513-6043z"
        fill="gray"
        fill-rule="nonzero"
      />
    </svg>
  ),
  amex: (
    <svg viewBox="0 0 40 24" className="w-10 h-6">
      <rect width="40" height="24" rx="4" fill="#006FCF" />
      <text
        x="20"
        y="15"
        textAnchor="middle"
        fill="white"
        fontSize="6"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
      >
        AMEX
      </text>
    </svg>
  ),
  discover: (
    <svg viewBox="0 0 40 24" className="w-10 h-6">
      <rect width="40" height="24" rx="4" fill="#FF6000" />
      <text
        x="20"
        y="15"
        textAnchor="middle"
        fill="white"
        fontSize="5"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
      >
        DISCOVER
      </text>
    </svg>
  ),
  generic: <CreditCardIcon className="w-10 h-6 opacity-60" />,
};

// Card style variants with improved base style
export type CardStyle =
  | "base"
  | "shiny-silver"
  | "amex-green"
  | "amex-black"
  | "metal";

const cardStyles: Record<CardStyle, string> = {
  // Base style matching shadcn card (white/clean)
  base: "bg-card border text-card-foreground shadow-sm",
  "shiny-silver":
    "bg-gradient-to-br from-gray-300 via-gray-100 to-gray-300 border-gray-400 text-gray-800 shadow-2xl",
  "amex-green":
    "bg-gradient-to-br from-green-700 via-green-600 to-green-800 border-green-500 text-white shadow-xl",
  "amex-black":
    "bg-gradient-to-br from-gray-900 via-black to-gray-800 border-gray-600 text-white shadow-2xl",
  metal:
    "bg-gradient-to-br from-slate-600 via-slate-500 to-slate-700 border-slate-400 text-white shadow-2xl backdrop-blur-sm",
};

const cardBackStyles: Record<CardStyle, string> = {
  base: "bg-muted border text-muted-foreground shadow-sm",
  "shiny-silver":
    "bg-gradient-to-br from-gray-400 via-gray-200 to-gray-400 border-gray-500 text-gray-800",
  "amex-green":
    "bg-gradient-to-br from-green-800 via-green-700 to-green-900 border-green-600 text-white",
  "amex-black":
    "bg-gradient-to-br from-black via-gray-900 to-black border-gray-700 text-white",
  metal:
    "bg-gradient-to-br from-slate-700 via-slate-600 to-slate-800 border-slate-500 text-white",
};

export interface CreditCardValue {
  cardholderName: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  network: string;
  id: string;
}

export interface CreditCardProps {
  value?: CreditCardValue;
  onChange?: (value: CreditCardValue) => void;
  onValidationChange?: (isValid: boolean, errors: ValidationErrors) => void;
  className?: string;
  ref?: React.RefObject<CreditCardRef>;
  cvvLabel?: "CCV" | "CVC";
  cardStyle?: CardStyle;
  showVendor?: boolean;
  setShowCardNumber: React.Dispatch<
    React.SetStateAction<{
      showCardNumber: boolean;
      selectedCard: string;
      index: number;
    }>
  >;
  showCardNumber: {
    showCardNumber: boolean;
    selectedCard: string;
    index: number;
  };
  fullCardNumber?: string;
  index: number;

  setShowCardCVV: React.Dispatch<
    React.SetStateAction<{
      show: boolean;
      selectedCard: string;
      index: number;
    }>
  >;
  showCardCVV: {
    show: boolean;
    selectedCard: string;
    index: number;
  };
}

export interface CreditCardRef {
  validate: () => boolean;
  isValid: () => boolean;
  focus: () => void;
  reset: () => void;
  getErrors: () => ValidationErrors;
}

interface ValidationErrors {
  cardholderName?: string;
  cardNumber?: string;
  expiryMonth?: string;
  expiryYear?: string;
  cvv?: string;
  general?: string;
}

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

const getCardType = (number: string): keyof typeof CardIcons => {
  const cleanNumber = number.replace(/\s/g, "");

  // Visa: starts with 4
  if (cleanNumber.startsWith("4")) return "visa";

  // Mastercard: starts with 5 or 2221-2720
  if (
    cleanNumber.startsWith("5") ||
    (cleanNumber.startsWith("2") &&
      parseInt(cleanNumber.substring(0, 4)) >= 2221 &&
      parseInt(cleanNumber.substring(0, 4)) <= 2720)
  ) {
    return "mastercard";
  }

  // American Express: starts with 34 or 37
  if (cleanNumber.startsWith("34") || cleanNumber.startsWith("37"))
    return "amex";

  // Discover: starts with 6011, 622126-622925, 644-649, 65
  if (
    cleanNumber.startsWith("6011") ||
    cleanNumber.startsWith("65") ||
    cleanNumber.startsWith("644") ||
    cleanNumber.startsWith("645") ||
    cleanNumber.startsWith("646") ||
    cleanNumber.startsWith("647") ||
    cleanNumber.startsWith("648") ||
    cleanNumber.startsWith("649")
  ) {
    return "discover";
  }

  return "generic";
};

const validateCreditCard = (
  value: CreditCardValue,
  cvvLabel: string,
): ValidationErrors => {
  const errors: ValidationErrors = {};

  // Validate cardholder name
  if (!value.cardholderName?.trim()) {
    errors.cardholderName = "Cardholder name is required";
  } else if (value.cardholderName.trim().length < 2) {
    errors.cardholderName = "Name must be at least 2 characters";
  }

  // Validate card number
  const cleanCardNumber = value.cardNumber?.replace(/\s/g, "") || "";
  if (!cleanCardNumber) {
    errors.cardNumber = "Card number is required";
  } else if (cleanCardNumber.length < 13 || cleanCardNumber.length > 19) {
    errors.cardNumber = "Invalid card number length";
  } else if (!/^\d+$/.test(cleanCardNumber)) {
    errors.cardNumber = "Card number must contain only digits";
  }

  // Validate expiry month
  if (!value.expiryMonth?.trim()) {
    errors.expiryMonth = "Expiry month is required";
  }

  // Validate expiry year
  if (!value.expiryYear?.trim()) {
    errors.expiryYear = "Expiry year is required";
  } else if (value.expiryMonth && value.expiryYear) {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const expiryYear = parseInt(value.expiryYear);
    const expiryMonth = parseInt(value.expiryMonth);

    if (
      expiryYear < currentYear ||
      (expiryYear === currentYear && expiryMonth < currentMonth)
    ) {
      errors.expiryYear = "Card has expired";
    }
  }

  // Validate CVV
  const cardType = getCardType(value.cardNumber || "");
  const expectedCvvLength = cardType === "amex" ? 4 : 3;
  if (!value.cvv?.trim()) {
    errors.cvv = `${cvvLabel} is required`;
  } else if (value.cvv.length !== expectedCvvLength) {
    errors.cvv = `${cvvLabel} must be ${expectedCvvLength} digits`;
  } else if (!/^\d+$/.test(value.cvv)) {
    errors.cvv = `${cvvLabel} must contain only digits`;
  }

  return errors;
};

function BankCard({
  value,
  onChange,
  onValidationChange,
  className,
  ref,
  cvvLabel = "CVC",
  cardStyle = "base",
  showVendor = true,
  setShowCardNumber,
  showCardNumber,
  fullCardNumber,
  index,
  setShowCardCVV,
  showCardCVV,
}: CreditCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [errors, setErrors] = useState<ValidationErrors>({});

  // 3D hover effect using framer-motion
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [15, -15]));
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-15, 15]));

  // Internal refs for DOM elements
  const containerRef = useRef<HTMLDivElement>(null);
  const cardholderInputRef = useRef<HTMLInputElement>(null);
  const cardNumberInputRef = useRef<HTMLInputElement>(null);
  const cvvInputRef = useRef<HTMLInputElement>(null);

  const currentValue = value || {
    cardholderName: "",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    network: "",
    id: "",
  };

  const validateAndUpdate = (newValue: CreditCardValue) => {
    const validationErrors = validateCreditCard(newValue, cvvLabel);
    setErrors(validationErrors);

    const isValid = Object.keys(validationErrors).length === 0;
    onValidationChange?.(isValid, validationErrors);

    return isValid;
  };

  const handleInputChange = (
    field: keyof CreditCardValue,
    newValue: string,
  ) => {
    const updatedValue = { ...currentValue, [field]: newValue };
    onChange?.(updatedValue);
    validateAndUpdate(updatedValue);
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.replace(/\s/g, "").length <= 19) {
      handleInputChange("cardNumber", formatted);
    }
  };

  const handleCvvFocus = () => {
    setIsFlipped(true);
    setFocusedField("cvv");
  };

  const handleCvvBlur = () => {
    setIsFlipped(false);
    setFocusedField(null);
  };

  const handleFieldFocus = (fieldName: string) => {
    setFocusedField(fieldName);
  };

  const handleFieldBlur = () => {
    setFocusedField(null);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) / rect.width);
    y.set((e.clientY - centerY) / rect.height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleValidate = () => {
    const isValid = validateAndUpdate(currentValue);

    if (!isValid) {
      if (errors.cardholderName) {
        cardholderInputRef.current?.focus();
      } else if (errors.cardNumber) {
        cardNumberInputRef.current?.focus();
      } else if (errors.cvv) {
        cvvInputRef.current?.focus();
      }
    }

    return isValid;
  };

  const handleReset = () => {
    setErrors({});
    setFocusedField(null);
    setIsFlipped(false);
    onChange?.({
      cardholderName: "",
      cardNumber: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
      network: "",
      id: "",
    });
  };

  const handleFocus = () => {
    cardholderInputRef.current?.focus();
  };

  const getErrors = () => errors;

  // React 19: Expose imperative methods via ref callback
  //   useEffect(() => {
  //     if (ref && "current" in ref) {
  //       //   ref.current = {
  //       //     validate: handleValidate,
  //       //     isValid: () =>
  //       //       Object.keys(validateCreditCard(currentValue, cvvLabel)).length === 0,
  //       //     focus: handleFocus,
  //       //     reset: handleReset,
  //       //     getErrors,
  //       //   };

  //       const imperativeMethods = {
  //         validate: handleValidate,
  //         isValid: () =>
  //           Object.keys(validateCreditCard(currentValue, cvvLabel)).length === 0,
  //         focus: handleFocus,
  //         reset: handleReset,
  //         getErrors,
  //       };

  //       ref.current = { ...ref.current, ...imperativeMethods };
  //     }
  //   }, [ref, currentValue, errors, handleValidate, handleReset, getErrors]);

  const cardType =
    (currentValue.network?.toLowerCase() as any as keyof typeof CardIcons) ||
    "visa";
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => currentYear + i);
  const months = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    return {
      value: month.toString().padStart(2, "0"),
      label: month.toString().padStart(2, "0"),
    };
  });

  // Get chip color based on card style
  const getChipColor = () => {
    switch (cardStyle) {
      case "base":
        return "bg-yellow-500";
      case "shiny-silver":
        return "bg-yellow-600";
      case "amex-green":
      case "amex-black":
        return "bg-yellow-400";
      case "metal":
        return "bg-yellow-300";
      default:
        return "bg-yellow-400";
    }
  };

  return (
    <div ref={containerRef} className={cn("w-full max-w-sm py-2", className)}>
      {/* Card Container with 3D effects using Tailwind CSS utilities */}
      <div className="relative h-56 mb-6 [perspective:1000px]">
        <motion.div
          className="relative w-full h-full [transform-style:preserve-3d]"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          style={{
            rotateX: rotateX,
            rotateY: isFlipped ? 180 : rotateY,
          }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Front of Card */}
          <Card
            className={cn(
              "absolute inset-0 w-full h-full p-6 flex flex-col justify-between [backface-visibility:hidden] shadow-xl",
              cardStyles[cardStyle],
            )}
          >
            <div className="flex justify-between items-start">
              <div
                className={cn("w-12 h-8 rounded shadow-md", getChipColor())}
              ></div>
              {/* Vendor logo moved to top right for now, will be repositioned */}
            </div>

            <div className="space-y-4">
              <div className="flex items-end justify-between">
                <div className="flex gap-2 items-center ">
                  <div className="text-xl font-mono tracking-wider font-bold">
                    {currentValue.cardNumber || "•••• •••• •••• ••••"}
                  </div>
                  <div>
                    {!showCardNumber?.showCardNumber ? (
                      <button
                        onClick={() =>
                          setShowCardNumber({
                            showCardNumber: true,
                            selectedCard: currentValue?.id,
                            index,
                          })
                        }
                      >
                        <Eye className="size-5" />
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          setShowCardNumber({
                            showCardNumber: false,
                            selectedCard: currentValue?.id,
                            index,
                          })
                        }
                      >
                        <EyeOff className="size-5" />
                      </button>
                    )}

                    <button
                      onClick={() =>
                        setShowCardNumber({
                          showCardNumber: false,
                          selectedCard: currentValue?.id,
                          index,
                        })
                      }
                    ></button>
                  </div>
                </div>

                <div className="flex justify-end items-end space-x-4">
                  <div className="text-right space-y-2">
                    <div className="text-xs opacity-70 uppercase font-small">
                      CVV
                    </div>
                    <div className="bg-white text-black px-2  rounded text-center font-mono font-bold">
                      {currentValue.cvv || "•••"}
                    </div>
                  </div>

                  {!showCardCVV?.show ? (
                    <button
                      onClick={() =>
                        setShowCardCVV({
                          show: true,
                          selectedCard: currentValue?.id,
                          index,
                        })
                      }
                    >
                      <Lock className="w-6 h-6 opacity-60" />
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        setShowCardCVV({
                          show: false,
                          selectedCard: currentValue?.id,
                          index,
                        })
                      }
                    >
                      <LockOpen className="w-6 h-6 opacity-60" />
                    </button>
                  )}
                </div>
              </div>

              {/* Bottom row: cardholder - expires - vendor logo */}
              <div className="flex justify-between items-end">
                <div className="flex-1">
                  <div className="text-xs opacity-70 uppercase font-medium">
                    Card Holder
                  </div>
                  <div className="font-bold text-sm">
                    {currentValue.cardholderName || "YOUR NAME"}
                  </div>
                </div>
                <div className="flex-1 text-center">
                  <div className="text-xs opacity-70 uppercase font-medium">
                    Expires
                  </div>
                  <div className="font-bold text-sm">
                    {currentValue.expiryMonth && currentValue.expiryYear
                      ? `${currentValue.expiryMonth}/${currentValue.expiryYear.slice(-2)}`
                      : "MM/YY"}
                  </div>
                </div>
                <div className="flex-1 flex justify-end">
                  {showVendor && CardIcons[cardType]}
                </div>
              </div>
            </div>
          </Card>

          {/* Back of Card */}
          <Card
            className={cn(
              "absolute inset-0 w-full h-full p-6 flex flex-col justify-between [backface-visibility:hidden] [transform:rotateY(180deg)] shadow-xl",
              cardBackStyles[cardStyle],
            )}
          >
            <div className="w-full h-12 bg-black mt-4 shadow-inner"></div>

            <div className="flex justify-end items-center space-x-4">
              <div className="text-right">
                <div className="text-xs opacity-70 uppercase font-medium">
                  {cvvLabel}
                </div>
                <div className="bg-white text-black px-3 py-1 rounded text-center font-mono font-bold">
                  {currentValue.cvv || "•••"}
                </div>
              </div>
              <Lock className="w-6 h-6 opacity-60" />
            </div>

            <div className="text-xs opacity-60 text-center font-medium">
              This card is protected by advanced security features
            </div>
          </Card>
        </motion.div>
      </div>

      {/* <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Cardholder Name
          </label>
          <Input
            ref={cardholderInputRef}
            type="text"
            placeholder="John Doe"
            value={currentValue.cardholderName}
            onChange={(e) =>
              handleInputChange("cardholderName", e.target.value.toUpperCase())
            }
            onFocus={() => handleFieldFocus("cardholderName")}
            onBlur={handleFieldBlur}
            className={cn(
              "transition-all duration-200",
              focusedField === "cardholderName" && "ring-2 ring-primary",
              errors.cardholderName && "border-destructive",
            )}
          />
          {errors.cardholderName && (
            <p className="text-destructive text-xs mt-1">
              {errors.cardholderName}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Card Number</label>
          <Input
            ref={cardNumberInputRef}
            type="text"
            placeholder="1234 5678 9012 3456"
            value={currentValue.cardNumber}
            onChange={handleCardNumberChange}
            onFocus={() => handleFieldFocus("cardNumber")}
            onBlur={handleFieldBlur}
            className={cn(
              "font-mono transition-all duration-200",
              focusedField === "cardNumber" && "ring-2 ring-primary",
              errors.cardNumber && "border-destructive",
            )}
            maxLength={19}
          />
          {errors.cardNumber && (
            <p className="text-destructive text-xs mt-1">{errors.cardNumber}</p>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Month</label>
            <Select
              value={currentValue.expiryMonth}
              onValueChange={(value) => handleInputChange("expiryMonth", value)}
            >
              <SelectTrigger
                className={cn(
                  "transition-all duration-200",
                  focusedField === "expiryMonth" && "ring-2 ring-primary",
                  errors.expiryMonth && "border-destructive",
                )}
              >
                <SelectValue placeholder="MM" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.expiryMonth && (
              <p className="text-destructive text-xs mt-1">
                {errors.expiryMonth}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Year</label>
            <Select
              value={currentValue.expiryYear}
              onValueChange={(value) => handleInputChange("expiryYear", value)}
            >
              <SelectTrigger
                className={cn(
                  "transition-all duration-200",
                  focusedField === "expiryYear" && "ring-2 ring-primary",
                  errors.expiryYear && "border-destructive",
                )}
              >
                <SelectValue placeholder="YYYY" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.expiryYear && (
              <p className="text-destructive text-xs mt-1">
                {errors.expiryYear}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">{cvvLabel}</label>
            <Input
              ref={cvvInputRef}
              type="text"
              placeholder="123"
              value={currentValue.cvv}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                if (value.length <= (cardType === "amex" ? 4 : 3)) {
                  handleInputChange("cvv", value);
                }
              }}
              onFocus={handleCvvFocus}
              onBlur={handleCvvBlur}
              className={cn(
                "font-mono text-center transition-all duration-200",
                focusedField === "cvv" && "ring-2 ring-primary",
                errors.cvv && "border-destructive",
              )}
              maxLength={cardType === "amex" ? 4 : 3}
            />
            {errors.cvv && (
              <p className="text-destructive text-xs mt-1">{errors.cvv}</p>
            )}
          </div>
        </div>
      </div> */}
    </div>
  );
}

BankCard.displayName = "BankCard";

export { BankCard };
