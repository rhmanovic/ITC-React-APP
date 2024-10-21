import React from 'react';
import { useActiveCategory } from '../contexts/ActiveCategoryContext.jsx';
import '../style/CategoryNavbar.css'; // Import the CSS styles

function CategoryNavbar() {
    const list = ["Steaks", "Salads", "Desserts", "Seafood", "Pasta", "Drinks"]
    const activeCategory = useActiveCategory(); // Assumes this returns the currently active category index

    return (
        <div id="navbar-example2" className="category-navbar sticky-top p-2" style={{ overflowX: 'auto', scrollBehavior: 'smooth' }}>
            <ul id="ullist" className="nav nav-pills d-flex flex-row flex-nowrap p-0">
                {list.map((item, index) => (
                    <li className="nav-item" key={index}>
                        <a 
                            className={`nav-link ${index === activeCategory ? 'active' : ''}`} 
                            href={`#scrollspyHeading${index + 1}`} 
                            data-index={index}
                        >
                            {item}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CategoryNavbar;
