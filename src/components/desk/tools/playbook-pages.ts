/**
 * Sample content for the front desk playbook. A one-dentist, two-chair PPO
 * practice on Dentrix: about 15 patients a day, Monday to Thursday 8 to 5,
 * lunch 1 to 2. Authors are Lori (office manager) and Dr. Jo. Every patient
 * name is invented.
 */

export type PlaybookSection =
  | "Insurance"
  | "Scheduling"
  | "Money"
  | "Dentrix"
  | "Patients"
  | "Closing";

export const PLAYBOOK_SECTIONS: PlaybookSection[] = [
  "Insurance",
  "Scheduling",
  "Money",
  "Dentrix",
  "Patients",
  "Closing",
];

export type PlaybookPage = {
  id: string;
  section: PlaybookSection;
  title: string;
  /** One line under the title in the results list. */
  summary: string;
  keywords: string[];
  steps: string[];
  /** One plain sentence. Rendered as a run-in sentence, never a box. */
  watchOut: string;
  source: string;
  updatedBy: "Lori" | "Dr. Jo";
  updated: string;
};

export const PLAYBOOK_PAGES: PlaybookPage[] = [
  {
    id: "verify-new-patient",
    section: "Insurance",
    title: "Verify a new patient's insurance before you book them",
    summary: "The five things you need, and where to get them, before an appointment goes on the schedule.",
    keywords: ["new patient", "verification", "eligibility", "subscriber id", "group number", "before booking", "portal"],
    steps: [
      "Take the patient's full name exactly as it is on their insurance, their date of birth, and the name of the plan. Ask them to spell the last name.",
      "Ask whether they are the subscriber or on someone else's plan. If someone else's, get that person's name and date of birth too (see the dependent page).",
      "Ask for the subscriber ID and the group number. If they have a card, both are on the front. If they have no card, say: \"No problem, I can look that up with your name and birthday.\"",
      "Log in to that insurer's portal (Delta Dental, Cigna, Aetna, MetLife, Mutual of Omaha) and search by name and date of birth. Read off the subscriber ID, group number, and the effective date.",
      "Check that coverage is active today and note the annual maximum, what is left, and whether the deductible is met.",
      "Type the subscriber ID and group number into the patient's insurance tab in Dentrix before you save the appointment. Both are required or the claim will not go out.",
      "If the portal cannot find them, call the insurer's provider line with name, date of birth and plan name. They will read the IDs back to you.",
    ],
    watchOut: "New patients are verified before they get an appointment, not on the day. A patient who arrives with a lapsed policy still gets treated, and then the office eats the bill.",
    source: "From Alexis's notes, and the way Dr. Jo does it",
    updatedBy: "Lori",
    updated: "3 days ago",
  },
  {
    id: "new-insurance",
    section: "Insurance",
    title: "A patient says they have new insurance",
    summary: "Usually at the six month checkup. What to collect and what to change in Dentrix so today's claim is not the one that bounces.",
    keywords: ["changed insurance", "new plan", "checkup", "update insurance", "card", "existing patient"],
    steps: [
      "Ask for the new card, or the plan name if there is no card. Photograph or scan the front and back if you have it.",
      "Open the patient in Dentrix, go to the Family File, and open the insurance information. Do not delete the old plan yet.",
      "Add the new carrier, the subscriber ID, the group number and the subscriber's name. Set the new plan as primary.",
      "Verify it on the insurer's portal the same way as a new patient. Confirm the effective date is on or before today.",
      "Once it is verified, mark the old plan as inactive. Keep it on file for a month in case a claim from the old plan is still open.",
      "Tell the patient what their new plan covers for today's visit, using the eligibility and benefits section, before they sit down.",
    ],
    watchOut: "If the patient only mentions the change at checkout, the claim for today has to be sent to the new insurer, so change the plan before you post the visit.",
    source: "From Alexis's notes",
    updatedBy: "Lori",
    updated: "5 days ago",
  },
  {
    id: "delta-care-facility",
    section: "Insurance",
    title: "Delta Care USA: the \"your facility\" check",
    summary: "If the portal says other facility, we cannot be paid and the patient has to call Delta Care. Here is exactly what to tell them.",
    keywords: ["delta care", "deltacare", "your facility", "other facility", "facility number", "assigned office", "not attached"],
    steps: [
      "Log in to the Delta Dental provider portal and search the patient by name and date of birth.",
      "Under provider status, look for the words \"your facility.\" That means the patient is assigned to us and the claim will pay.",
      "If it says \"other facility,\" stop. The patient is assigned to another office and we cannot be paid for the visit, even if everything else looks active.",
      "Tell the patient: \"Your plan has you assigned to a different office. Before we can see you, you will need to call Delta Care at the number on your card and ask them to move you to our office. Our facility number is on the card by the front desk.\"",
      "Give them the practice facility number written down. The change is usually effective the first of the next month, so book them after that date.",
      "Note the call in the patient's Dentrix notes with the date you told them, so nobody books them early by mistake.",
    ],
    watchOut: "Delta Care USA is the only insurer we have seen do this so far, which does not mean it is the only one. If any portal shows an office assignment, treat it the same way.",
    source: "From Alexis's notes, confirmed by Dr. Jo",
    updatedBy: "Lori",
    updated: "3 days ago",
  },
  {
    id: "subscriber-vs-dependent",
    section: "Insurance",
    title: "Subscriber or dependent: what you need for a dependent",
    summary: "A child or spouse on someone else's plan. Without the subscriber's details the insurer will not talk to you.",
    keywords: ["dependent", "subscriber", "spouse", "child", "policy holder", "main subscriber", "family plan"],
    steps: [
      "Ask: \"Is the insurance in your name, or is it through a spouse or parent?\" If it is through someone else, the patient is a dependent.",
      "Collect the subscriber's full name and date of birth. The subscriber ID is the same number for everyone on the plan, but the insurer files it under the subscriber's name.",
      "For a child, also ask which parent carries the plan. Divorced parents often each carry a plan, and the birthday rule decides which is primary: the parent whose birthday comes first in the calendar year is primary.",
      "In Dentrix, enter the subscriber as the guarantor on the Family File and attach the patient to that plan, marking the relationship (spouse, child).",
      "On the portal, search by the subscriber first, then pick the dependent from the family list. Searching by the child's name alone often returns nothing.",
      "If you have to call the insurer, have the subscriber's name and date of birth ready before you dial. Without them the call ends with no answer.",
    ],
    watchOut: "A dependent can age out. Most plans drop children at 26, some at 19 unless a student, so check the effective dates on the dependent, not just the plan.",
    source: "From the Dentrix Getting Started manual, page 41, and Alexis's notes",
    updatedBy: "Lori",
    updated: "1 week ago",
  },
  {
    id: "where-copay-comes-from",
    section: "Insurance",
    title: "Where the copay comes from",
    summary: "The eligibility and benefits section is the one Dr. Jo opens to decide what to charge. How to read it.",
    keywords: ["copay", "co-pay", "coverage percentage", "preventive", "basic", "major", "deductible", "annual maximum", "what to charge", "estimate"],
    steps: [
      "Open the patient's plan on the insurer's portal and find the section called eligibility and benefits (some portals call it benefit summary).",
      "Write down four numbers: the annual maximum, the amount remaining this year, the deductible, and how much of the deductible has been met.",
      "Find the coverage percentages by category. On our PPO plans it is usually preventive 100%, basic 80%, major 50%. A crown is major. A filling is basic. An exam and cleaning is preventive.",
      "Copay is the patient's share: the fee times what the plan does not cover, plus any deductible not yet met. Example: a $680 crown at 50% with the deductible already met is $340 from the patient.",
      "If the remaining annual maximum is less than the insurer's share, the patient pays the difference too. Say so before treatment starts.",
      "Put the estimate on the treatment plan in Dentrix and tell the patient it is an estimate until the claim is paid.",
    ],
    watchOut: "The portal shows coverage by category, not by procedure. A crown can still be reviewed after the claim is filed and judged not necessary, and then the patient owns the bill.",
    source: "From Dr. Jo, written down by Lori",
    updatedBy: "Dr. Jo",
    updated: "2 days ago",
  },
  {
    id: "cigna-portal-quirks",
    section: "Insurance",
    title: "Cigna PPO portal quirks",
    summary: "Cigna takes the most time of any of our plans. The things that trip people up, in the order they happen.",
    keywords: ["cigna", "portal", "login", "search", "member id", "zip code", "timeout", "slow"],
    steps: [
      "Cigna wants the member ID up front. If the patient has no card, search by name, date of birth and zip code instead; the zip must match the subscriber's home address, not the patient's.",
      "The portal logs you out after about ten minutes idle. Copy the subscriber ID and group number into Dentrix as soon as they appear, then go back for the benefits.",
      "Cigna shows the group number on the eligibility page, not the benefits page. It is labelled \"account number\" on some plans.",
      "For dependents, Cigna lists everyone under the subscriber. Click the patient's own row or you will read the subscriber's used benefits by mistake.",
      "If the portal returns \"no record found\" for a patient who has a Cigna card, the plan may be Cigna Dental administered by another company. The card's back lists the claims address; the company name there is who to call.",
      "Cigna's provider line is on the back of every Cigna card. Have the patient's name, date of birth and our tax ID ready.",
    ],
    watchOut: "Do not verify Cigna patients while they are standing at the desk. Do it the day before, from the confirmation list, so the wait happens when nobody is watching.",
    source: "From Lori, learned the hard way",
    updatedBy: "Lori",
    updated: "yesterday",
  },
  {
    id: "confirm-tomorrow",
    section: "Scheduling",
    title: "Confirming tomorrow's patients by phone",
    summary: "The 3 pm call list. A script that takes under a minute per patient and catches insurance changes a day early.",
    keywords: ["confirm", "confirmation", "phone call", "script", "tomorrow", "reminder", "appointment", "3pm"],
    steps: [
      "At 3 pm, open tomorrow's schedule in Dentrix and print or pull up the list. There are usually 12 to 16 names.",
      "Call each patient. Script: \"Hi, this is Lori from Tri-Valley Dental. I'm calling to confirm your appointment tomorrow at [time] with Dr. Jo. Does that still work?\"",
      "If yes: \"Great. Has anything changed with your insurance since your last visit?\" If they say yes, collect the new plan now (see the new insurance page).",
      "If no answer, leave a message with the time and our number, and mark the appointment as \"left message\" in Dentrix.",
      "If they need to reschedule, offer the next two open slots and move them right away. Do not leave a hole on tomorrow's schedule without trying the short-notice list first.",
      "Mark every confirmed appointment in Dentrix so the morning schedule shows who is confirmed at a glance.",
    ],
    watchOut: "Lunch is 1 to 2 and the last patient is seen at 5, so a patient confirming for \"1:30\" is a schedule error; check before you agree.",
    source: "From Alexis's notes",
    updatedBy: "Lori",
    updated: "4 days ago",
  },
  {
    id: "late-and-no-show",
    section: "Scheduling",
    title: "Running late and no-shows",
    summary: "What to do at 10 minutes late, at 15, and after a no-show, so two chairs stay full without anyone feeling punished.",
    keywords: ["late", "no show", "no-show", "missed appointment", "cancellation", "policy", "reschedule", "short notice"],
    steps: [
      "At 10 minutes past the appointment, call the patient. Most are parking. Ask how far away they are.",
      "At 15 minutes, tell Dr. Jo. She decides whether the remaining time is enough for the planned procedure or whether it becomes a shorter visit.",
      "If the patient will arrive more than 20 minutes late, offer to reschedule rather than squeeze them in. Say: \"I want to make sure you get the full time with Dr. Jo, so let's find a better slot.\"",
      "After a no-show, call once that day and once the next morning. Log both calls in Dentrix.",
      "Mark the appointment as broken in Dentrix so the patient's history shows it. Two no-shows in a year means future appointments are confirmed the morning of, not the day before.",
      "Fill the gap from the short-notice list: patients who asked to be called if something opens up. Keep that list on the desk.",
    ],
    watchOut: "We do not charge a no-show fee today. Do not tell a patient they will be charged, even if the old manual says so.",
    source: "From Dr. Jo",
    updatedBy: "Dr. Jo",
    updated: "2 weeks ago",
  },
  {
    id: "posting-a-payment",
    section: "Money",
    title: "Posting a payment",
    summary: "Card, cash or check at checkout, entered in Dentrix so the ledger and the day sheet agree tonight.",
    keywords: ["payment", "post", "ledger", "checkout", "card", "cash", "check", "receipt", "day sheet"],
    steps: [
      "With the patient at the desk, open their Ledger in Dentrix. Today's procedures should already be posted by the assistant; if not, ask before taking payment.",
      "Tell the patient the estimated portion for today from the treatment plan. Say it is an estimate until insurance pays.",
      "Run the card on the terminal, or take the check or cash. For a check, write the check number on the deposit slip now.",
      "In the Ledger, choose Enter Payment. Pick the payment type (Visa, Mastercard, check, cash), enter the amount, and put the check number or the last four card digits in the note.",
      "Apply the payment to today's procedures, not to the oldest balance, unless Dr. Jo says otherwise.",
      "Print or email the walkout statement. Ask which they prefer and note it on the patient.",
    ],
    watchOut: "If the amount on the terminal and the amount in Dentrix differ, fix it before the patient leaves. A ten dollar mismatch found at closing takes an hour to trace.",
    source: "From the Dentrix Getting Started manual, page 88",
    updatedBy: "Lori",
    updated: "6 days ago",
  },
  {
    id: "aging-report",
    section: "Money",
    title: "Reading the aging report",
    summary: "Every claim we have sent, by date and patient. The only place an unpaid claim shows up before it becomes a letter.",
    keywords: ["aging report", "unpaid claims", "outstanding", "30 days", "60 days", "insurance aging", "follow up", "call the insurer"],
    steps: [
      "In Dentrix, open Office Manager, then Reports, then Ledger, then Insurance Aging Report. Run it for all providers, all carriers.",
      "The report lists each claim with the date sent and how many days it has been out: 0 to 30, 31 to 60, 61 to 90, over 90.",
      "Anything past 30 days needs a call. Most of our PPOs pay in two to three weeks, so a claim at 30 days is usually stuck, not slow.",
      "Before calling, open the claim in Dentrix and check the subscriber ID and group number are filled in. A missing group number is the most common reason a claim went nowhere.",
      "Call the insurer's provider line with the claim date, patient name, subscriber ID and our tax ID. Ask for the claim status and, if it was denied, the reason and the appeal address.",
      "Write the outcome in the claim's note in Dentrix with the date and who you spoke to. Then the next person does not call twice.",
    ],
    watchOut: "Run this every Thursday. Denials arrive weeks later by mail, and a claim that was never received arrives never.",
    source: "From Dr. Jo, written down by Lori",
    updatedBy: "Lori",
    updated: "yesterday",
  },
  {
    id: "add-new-patient",
    section: "Dentrix",
    title: "Adding a new patient in Dentrix",
    summary: "The Family File, in the order that avoids duplicates and the end-of-day claim warning.",
    keywords: ["new patient", "family file", "add patient", "dentrix", "guarantor", "chart", "duplicate"],
    steps: [
      "Search first. In Family File, press Select Patient and type the last name. Duplicate charts are the number one Dentrix headache and they start here.",
      "If the patient is new, choose New Family if they are the head of household, or add them to an existing family if a spouse or parent is already a patient.",
      "Fill in: last name, first name, date of birth, gender, phone, email, and address. Spell the name exactly as on the insurance card.",
      "Set the guarantor (who gets the bill). For a child it is the parent; for an adult on a spouse's plan it is still usually themselves.",
      "Open the insurance information and add the carrier, subscriber ID, group number, subscriber name and relationship. Both IDs are required.",
      "Assign the provider (Dr. Jo) and save. Then book the appointment from the Appointment Book, not from the Family File.",
    ],
    watchOut: "The 2004 manual says to fax the insurance card to the carrier. Do not. Verify on the portal instead.",
    source: "From the Dentrix Getting Started manual, page 23",
    updatedBy: "Lori",
    updated: "1 week ago",
  },
  {
    id: "email-only-patient",
    section: "Patients",
    title: "A patient who wants email only",
    summary: "A few patients ask for no calls. How to set that in Dentrix and what still has to happen by phone.",
    keywords: ["email", "no calls", "contact preference", "reminder", "communication", "text", "do not call"],
    steps: [
      "In the patient's Family File, open the contact preferences and set the preferred method to email. Confirm the email address by reading it back.",
      "Add a note on the patient: \"Email only for reminders. OK to call for same-day changes.\" Most patients agree to that when asked.",
      "For confirmation, send the appointment email two days before instead of the 3 pm call. Keep the same wording as the phone script.",
      "If the email bounces or there is no reply by the morning of, call. A no-reply is not a confirmation.",
      "Anything about money or insurance that needs an answer today still gets a phone call. Email is for reminders, not for decisions.",
    ],
    watchOut: "Do not put treatment details or insurance numbers in an email. Appointment time and our phone number only.",
    source: "From Dr. Jo",
    updatedBy: "Lori",
    updated: "5 days ago",
  },
  {
    id: "ask-for-review",
    section: "Patients",
    title: "Asking for a review at checkout",
    summary: "The QR code by the desk, the one sentence to say, and who not to ask.",
    keywords: ["review", "google review", "yelp", "qr code", "survey", "checkout", "ask", "feedback"],
    steps: [
      "Ask only patients who had a good visit. If Dr. Jo mentioned a problem, or the patient was in pain or frustrated, skip it today.",
      "After payment, say: \"If you have a minute, we would love a quick review. The code by the desk takes you straight there.\" Point to the QR card.",
      "The code opens our review page directly, so the patient never has to search for us. If they prefer, they can scan it later; the card stands next to the pens.",
      "Do not offer anything in exchange for a review. It is against the review sites' rules and Dr. Jo does not want it.",
      "If a patient says something kind out loud, that is the moment. \"Would you mind writing that in a review?\" works better than any card.",
    ],
    watchOut: "Never ask a patient to change or remove a review, and never reply to a negative one yourself. Tell Dr. Jo and she will answer it.",
    source: "From Dr. Jo",
    updatedBy: "Dr. Jo",
    updated: "3 days ago",
  },
  {
    id: "group-number-missing",
    section: "Closing",
    title: "End of day: the \"group number is missing\" e-claim warning",
    summary: "The warning that stops a claim from going out. What it means and the two minute fix, before you go home.",
    keywords: ["e-claims", "eclaims", "group number is missing", "warning", "end of day", "claim not sent", "batch", "closing"],
    steps: [
      "At closing, send the day's claims from Office Manager, then Batch Processor. Dentrix checks each claim before it goes.",
      "If you see \"group number is missing\" (or \"subscriber ID is missing\"), that claim did not send. It will sit unsent until fixed, and nobody gets paid for that visit.",
      "Open the patient's Family File, then the insurance information. Fill in the missing group number from the card or from the insurer's portal.",
      "If there is no card and the portal is closed for the night, call the patient in the morning. Do not guess a number to make the warning go away.",
      "Go back to the Batch Processor and resend that one claim. Confirm it shows as sent.",
      "Write the patient's name on the closing sheet so tomorrow's first job is to check the claim went through.",
    ],
    watchOut: "The warning is about the claim, not the patient. The visit is posted and the ledger is right; only the insurance side is stuck.",
    source: "From Alexis's notes, and the Dentrix Getting Started manual, page 112",
    updatedBy: "Lori",
    updated: "2 days ago",
  },
];
