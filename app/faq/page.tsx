import { Metadata } from 'next'
import Header from '@/components/Header'
import { Footer } from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Frequently Asked Questions - Baseer Smart Glasses',
  description: 'Find answers to common questions about Baseer Smart Glasses for the visually impaired.',
}

const faqs = [
  {
    question: "What are Baseer Smart Glasses?",
    answer: "Baseer Smart Glasses are advanced wearable devices designed to assist visually impaired individuals in navigating their environment and performing daily tasks with greater ease and independence."
  },
  {
    question: "How do Baseer Smart Glasses work?",
    answer: "Baseer Smart Glasses use a combination of cameras, sensors, and AI technology to analyze the user's surroundings. They provide audio descriptions of objects, people, and text in the environment, helping users to better understand and interact with their surroundings."
  },
  {
    question: "Are Baseer Smart Glasses suitable for all types of visual impairments?",
    answer: "Baseer Smart Glasses can benefit individuals with various degrees of visual impairment, from partial to complete vision loss. However, the effectiveness may vary depending on the specific condition. We recommend consulting with your eye care professional to determine if they are suitable for your needs."
  },
  {
    question: "Can Baseer Smart Glasses read text?",
    answer: "Yes, Baseer Smart Glasses have a text recognition feature that can read printed text, signs, and digital displays. The glasses will read the text aloud to the user through the built-in speakers or connected earphones."
  },
  {
    question: "How long does the battery last?",
    answer: "The battery life of Baseer Smart Glasses typically lasts up to 8 hours with normal use. However, this may vary depending on the features being used and the intensity of use."
  },
  {
    question: "Are Baseer Smart Glasses water-resistant?",
    answer: "Baseer Smart Glasses are splash-resistant, meaning they can withstand light rain or accidental water splashes. However, they are not waterproof and should not be submerged in water or worn during heavy rain."
  },
  {
    question: "How do I control Baseer Smart Glasses?",
    answer: "Baseer Smart Glasses can be controlled through voice commands, a touch pad on the side of the frames, or via a companion smartphone app. The glasses also have buttons for basic functions like power and volume control."
  },
  {
    question: "Do Baseer Smart Glasses require an internet connection?",
    answer: "While many features work offline, some advanced features like real-time language translation or certain AI-powered object recognition capabilities may require an internet connection for optimal performance."
  },
  {
    question: "Can Baseer Smart Glasses be used with prescription lenses?",
    answer: "Yes, Baseer Smart Glasses can be fitted with prescription lenses. We work with opticians to ensure that the smart technology integrates seamlessly with your prescription needs."
  },
  {
    question: "What kind of warranty comes with Baseer Smart Glasses?",
    answer: "Baseer Smart Glasses come with a standard one-year warranty that covers manufacturing defects. We also offer extended warranty options for additional peace of mind."
  }
]

export default function FAQPage() {
  return (
    <>
      <Header>
        <main className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Frequently Asked Questions</h1>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-card text-card-foreground p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-2">{faq.question}</h2>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </main>
      </Header>
      <Footer />
    </>
  )
}

