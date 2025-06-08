using Application;
using Application.Common.Interfaces;
using FluentValidation;
using Infrastructure;
using Infrastructure.Persistence;
using MediApp.Installers;
using MediApp.Options;
using MediApp.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System.Reflection;

namespace MediApp
{
    public class Startup(IConfiguration configuration, IWebHostEnvironment environment)
    {
        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddPolicy("Cors",
                    builder => { builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader(); });
            });

            services.AddApplication();

            services.AddInfrastructure(configuration, environment);

            services.AddScoped<ICurrentUserService, CurrentUserService>();

            services.AddHttpContextAccessor();

            services.AddHealthChecks()
                .AddDbContextCheck<ApplicationDbContext>();

            services.Scan(scan => scan
                                      .FromAssemblies(Assembly.GetExecutingAssembly())
                                      .AddClasses(classes => classes.AssignableTo(typeof(IValidator<>)))
                                      .AsImplementedInterfaces()
                                      .WithTransientLifetime()
                         );

            services.AddControllers();

            services.InstallServicesInAssembly(configuration);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseCors("Cors");

            if (env.IsDevelopment()) app.UseDeveloperExceptionPage();

            app.UseHttpsRedirection();

            app.UseStaticFiles();

            app.UseRouting();

            app.UseHealthChecks("/health");

            app.UseAuthentication();

            app.UseAuthorization();

            var swaggerOptions = new SwaggerOptions();
            configuration.GetSection(nameof(SwaggerOptions)).Bind(swaggerOptions);

            app.UseSwagger(option => { option.RouteTemplate = swaggerOptions.JsonRoute; });

            app.UseSwaggerUI(option =>
            {
                option.SwaggerEndpoint(swaggerOptions.UiEndpoint, swaggerOptions.Description);
            });

            app.UseEndpoints(endpoints => { endpoints.MapControllers(); });
        }
    }
}