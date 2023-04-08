
const categories = [
    {
      category: 'LGBTQ+ History',
      questions: [
        {
          question: 'What year did the Stonewall Riots take place?',
          value: 200
        },
        {
          question: 'Who was the first openly gay person elected to public office in the United States?',
          value: 400
        },
        {
          question: 'What is the significance of the pink triangle symbol in LGBTQ+ history?',
          value: 600
        },
        {
          question: 'What was the name of the first LGBTQ+ rights organization in the United States?',
          value: 800
        },
        {
          question: 'What was the name of the 1969 New York City bar where the Stonewall Riots took place?',
          value: 1000
        }
      ]
    },
    {
      category: 'Queer Representation in Media',
      questions: [
        {
          question: 'Who was the first openly gay character on American television?',
          value: 200
        },
        {
          question: 'What was the first mainstream Hollywood film to feature a same-sex kiss?',
          value: 400
        },
        {
          question: 'What was the name of the first lesbian-themed feature film produced in the United States?',
          value: 600
        },
        {
          question: 'What is the name of the drag queen who won Season 4 of RuPaul\'s Drag Race?',
          value: 800
        },
        {
          question: 'What is the name of the queer television series that premiered on Netflix in 2019 and follows the lives of eight people around the world?',
          value: 1000
        }
      ]
    }
  ];
function Jeopardy() {
    return (
      <div className="bg-blue-800 text-white h-screen">
        <div className="container mx-auto py-8">
          <div className="grid grid-cols-5 gap-4">
            {categories.map((category, index) => (
              <div key={index} className="bg-blue-600 p-4 rounded">
                <h2 className="text-lg font-bold mb-4">{category.category}</h2>
                {category.questions.map((question, index) => (
                  <div key={index} className="p-2 rounded my-2 cursor-pointer hover:bg-blue-500">
                    <p className="font-bold">{question.question}</p>
                    <p className="text-sm">${question.value}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

    export default Jeopardy;