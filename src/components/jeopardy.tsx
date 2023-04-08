import { useState } from 'react';
import { categories } from './defaultQs';
import { api } from "y/utils/api";

type Category = {
    catTitle: string;
    catData: {
      value: number;
      question: string;
      answer: string;
    }[];
  };
  


function Jeopardy() {
    const getNewCategoryData = api.chatGPT.getNewCategory.useMutation();

    const [currentCategories, setCurrentCategories] = useState<Category[] | undefined | string>(categories);
    const [inputValue, setInputValue] = useState<string>('');
    
    const handleSubmit = (inputValue: string) => {
        console.log(inputValue);
        const text: string = inputValue;
        getNewCategoryData.mutate({ text });
        console.log(getNewCategoryData.data);

        if (getNewCategoryData.data) {
            const newCategory = getNewCategoryData.data;
            setCurrentCategories([newCategory]);
        }

      };



  return (
    <div className="bg-blue-800 text-white h-screen">
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-5 md:col-span-4">
            
          </div>
          {currentCategories.map((category) => (

              <><div className="flex mb-4">
                  <input
                      type="text"
                      className="bg-gray-700 rounded-l px-4 py-2 flex-1"
                      value={inputValue}
                      onChange={( e ) => setInputValue( e.target.value )} />
                  <button
                      className="bg-gray-600 hover:bg-gray-700 rounded-r px-4 py-2"
                      onClick={() => {
                          handleSubmit( inputValue );
                      } }
                  >
                      Submit
                  </button>
              </div>
              <div key={category.catTitle} className="bg-blue-600 p-4 rounded">
                      <h2 className="text-lg font-bold mb-4">{category.catTitle}</h2>
                      {category.catData.map( ( question ) => (
                          <div key={question.question} className="p-2 rounded my-2 cursor-pointer hover:bg-blue-500">
                              <p className="font-bold">{question.question}</p>
                              <p className="text-sm">${question.value}</p>
                          </div>
                      ) )}
                  </div></>
          ))}
          {/* Add empty columns to fill up the grid */}
          {Array.from({ length: 5 - (currentCategories.length % 5) }, (_, index) => (
            <div key={`empty-${index}`} className="bg-blue-600 p-4 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Jeopardy;
