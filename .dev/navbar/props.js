const config = {items:[]};
/**
 * Props item - Houses all the navbar items and submenu items
 */

const props = [    
   {
       name: 'activity',
       labelText: {
           en: 'Activity'
      },
       hasSubmenu: true,
       submenuItems: config.items.map((item) => {
          return {
              name: item.url,
              labelText: item.menuName,
          }
      })
      
  },  
];


module.exports = props;