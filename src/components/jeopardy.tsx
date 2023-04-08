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

type ColumnProps = {
    category: Category;
    onSubmit: (inputValue: string) => void;
};

function Column({ category, onSubmit }: ColumnProps) {
    const [inputValue, setInputValue] = useState<string>('');

    return (
        <div key={category.catTitle} className="bg-blue-600 p-4 rounded">
            <h2 className="text-lg font-bold mb-4">{category.catTitle}</h2>
            <div className="flex mb-4">
                <input
                    type="text"
                    className="bg-gray-700 rounded-l px-4 py-2 flex-1"
                    value={inputValue}
                    onChange={( e ) => setInputValue( e.target.value )}
                />
                <button
                    className="bg-gray-600 hover:bg-gray-700 rounded-r px-4 py-2"
                    onClick={() => {
                        onSubmit(inputValue);
                        setInputValue('');
                    }}
                >
                    Submit
                </button>
            </div>
            {category.catData.map((question) => (
                <div key={question.question} className="p-2 rounded my-2 cursor-pointer hover:bg-blue-500">
                    <p className="font-bold">{question.question}</p>
                    <p className="text-sm">${question.value}</p>
                </div>
            ))}
        </div>
    );
}

function Jeopardy() {
    const getNewCategoryData = api.chatGPT.getNewCategory.useMutation();

    const [currentCategories, setCurrentCategories] = useState<Category[]>(categories);

    const handleSubmit = (inputValue: string, index: number) => {
        console.log(inputValue);
        const text: string = inputValue;
        getNewCategoryData.mutate({ text });
        console.log(getNewCategoryData.data);

        if (getNewCategoryData.data) {
            const newCategory = getNewCategoryData.data;
            const newCategories = [...currentCategories];
            newCategories[index + 1] = newCategory;
            setCurrentCategories(newCategories);
        }
    };

    return (
        <div className="bg-blue-800 text-white h-screen">
            <div className="container mx-auto py-8">
                <div className="grid grid-cols-5 gap-4">
                    {currentCategories.map((category, index) => (
                        <div className="col-span-1" key={category.catTitle}>
                            <Column category={category} onSubmit={(inputValue) => handleSubmit(inputValue, index)} />
                        </div>
                    ))}
                    {/* Add empty columns to fill up the grid */}
                    {Array.from({ length: 5 - (currentCategories.length % 2) }, (_, index) => (
                        <div key={`${index}`} className="bg-blue-600 p-4 rounded"></div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Jeopardy;
