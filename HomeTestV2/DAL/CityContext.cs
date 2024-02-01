using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using HomeTestV2.Models;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;

namespace HomeTestV2.DAL
{
    public class CityContext: DbContext
    {
        public CityContext() : base("HomeTestV2")
        { 
        }

        public DbSet<City> Cities { get; set;}

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
        }
    }
}