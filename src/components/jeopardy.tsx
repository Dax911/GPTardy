import { categories } from './defaultQs';

function Jeopardy() {
    return (
      <div className="bg-blue-800 text-white h-screen">
        <div className="container mx-auto py-8">
          <div className="grid grid-cols-5 gap-4">
            {categories.map((category, index) => (
              <div key={index} className="bg-blue-600 p-4 rounded">
                <h2 className="text-lg font-bold mb-4">{category.title}</h2>
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